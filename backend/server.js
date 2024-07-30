const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5003;

console.log('Server script started'); // Initial log to confirm script execution








// // Login endpoint
// app.post('/login', async (req, res) => {
//   console.log('Login request received');  // Log at the start of the login route
//   const { email, password } = req.body;

//   try {
//     console.log('Querying database for user with email:', email);  // Log email before querying
//     const userQuery = 'SELECT * FROM users WHERE email = $1';
//     const userResult = await pool.query(userQuery, [email]);

//     if (userResult.rows.length === 0) {
//       console.log('User not found for email:', email);
//       return res.status(400).json({ message: 'User not found' });
//     }

//     const user = userResult.rows[0];
//     console.log('User found:', user); // Log the found user

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       console.log('Invalid credentials for email:', email);
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const tokenPayload = { userId: user.user_id };
//     console.log('Token Payload:', tokenPayload); // Log the payload

//     const token = jwt.sign(tokenPayload, 'your_jwt_secret', {
//       expiresIn: '1h',
//     });

//     res.json({ token, user });
//     // res.json({ token });
//   } catch (err) {
//     console.error('Login error:', err.message);
//     res.status(500).send('Server error');
//   }
// });


app.post('/login', async (req, res) => {
  console.log('Login request received');  // Log at the start of the login route
  const { email, password } = req.body;

  try {
    console.log('Querying database for user with email:', email);  // Log email before querying
    const userQuery = 'SELECT * FROM users WHERE email = $1';
    const userResult = await pool.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
      console.log('User not found for email:', email);
      return res.status(400).json({ message: 'User not found' });
    }

    const user = userResult.rows[0];
    console.log('User found:', user); // Log the found user

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('Invalid credentials for email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if the user's role_id is 3
    if (user.role_id !== 3) {
      console.log('Unauthorized role_id for email:', email);
      return res.status(403).json({ message: 'Unauthorized role' });
    }

    const tokenPayload = { userId: user.user_id };
    console.log('Token Payload:', tokenPayload); // Log the payload

    const token = jwt.sign(tokenPayload, 'your_jwt_secret', {
      expiresIn: '1h',
    });

    res.json({ token, user });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).send('Server error');
  }
});





const authenticateToken = (req, res, next) => {
  console.log('Authenticating token');  // Log at the start of token authentication
  const token = req.header('Authorization');

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    console.log('Decoded Token:', decoded); // Log the decoded token
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error('Token error:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Test route to print warden ID
app.get('/test', authenticateToken, (req, res) => {
  console.log('Warden ID:', req.userId);
  res.json({ message: 'Warden ID logged in console', userId: req.userId });
});





// Check parking status endpoint
app.post('/check-parking-status', async (req, res) => {
  const { vehicle_id, user_id } = req.body;

  try {
    const vehicleQuery = 'SELECT isparked FROM vehicle WHERE vehicle_id = $1';
    const vehicleResult = await pool.query(vehicleQuery, [vehicle_id]);

    if (vehicleResult.rows.length === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const driverQuery = 'SELECT isparked FROM driver WHERE driver_id = $1';
    const driverResult = await pool.query(driverQuery, [user_id]);

    if (driverResult.rows.length === 0) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    const isVehicleParked = vehicleResult.rows[0].isparked;
    const isDriverParked = driverResult.rows[0].isparked;

    res.json({ isVehicleParked, isDriverParked });
  } catch (error) {
    console.error('Error checking parking status:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});





// // Assign parking endpoint
// app.post('/assign-parking', async (req, res) => {
//   const { vehicle_id, user_id, parking_slot_id } = req.body;

//   // INSERT INTO parking_assignment (vehicle_id, user_id, parking_slot_id)
//   // VALUES ($1, $2, $3)

//   try {
//       const queryText = `
//           INSERT INTO parking_assignment (vehicle_id, user_id, parking_slot_id, in_time1)
//         VALUES ($1, $2, $3, NOW());
//       `;
//       await pool.query(queryText, [vehicle_id, user_id, parking_slot_id]);

//       res.status(200).json({ message: 'Parking slot assigned successfully' });
//   } catch (error) {
//       console.error('Error assigning parking slot:', error);
//       res.status(500).json({ message: 'Internal Server Error' });
//   }
// });



//assign parking endpoint
app.post('/assign-parking', async (req, res) => {
  const { vehicle_id, driver_id, user_id } = req.body;
  console.log('userissdddd:', user_id);

  try {
    console.log('userissdddd:', user_id);

    const getWardenId = `
          SELECT warden_id 
          FROM warden 
          WHERE user_id = $1 ;
        `;
    const resultGetWardenId = await pool.query(getWardenId, [user_id]);
    const warden_id = resultGetWardenId.rows[0].warden_id;
    console.log('warden_id of particular bla bla:', warden_id);


    const getLotId = `
          SELECT lot_id 
          FROM warden_parking_lot 
          WHERE warden_id = $1 ;
        `;
    const resultGetLotId = await pool.query(getLotId, [warden_id]);
    const lot_id = resultGetLotId.rows[0].lot_id;
    console.log('lot_id of particular bla bla:', lot_id);


    const driverVehicleQuery = `
          SELECT driver_vehicle_id 
          FROM driver_vehicle 
          WHERE vehicle_id = $1 AND driver_id = $2;
        `;

    // Execute the query to get driver_vehicle_id
    const result = await pool.query(driverVehicleQuery, [vehicle_id, driver_id]);
    // console.log('Query Result:', result.rows);
    const driver_vehicle_id = result.rows[0].driver_vehicle_id;
    console.log('driver_vehicle_id:', driver_vehicle_id);
    const insertQuery = `
      INSERT INTO parking_instance (driver_vehicle_id, in_time,lot_id,warden_id)
      VALUES ($1, NOW(),$2,$3);
    `;
    // Insert the data into parking_instance table
    await pool.query(insertQuery, [driver_vehicle_id, lot_id, warden_id]);

    console.log('driver_vehicle_idabhbai:', driver_vehicle_id);

    const updateVehicleTable = `
      UPDATE vehicle SET isparked = true WHERE vehicle_id = $1;
      `;
    await pool.query(updateVehicleTable, [vehicle_id]);
    console.log('update isp arked in vehicle batblr:', vehicle_id);

    const updateDriverTable = `
      UPDATE driver SET isparked = true WHERE driver_id = $1;
      `;
    await pool.query(updateDriverTable, [driver_id]);
    console.log('update isparked in driver table:', driver_id);


    res.status(200).json({ message: 'Parking slot assigned successfully' });
  } catch (error) {
    console.error('Error assigning parking slot:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});




// //fetching parked vehicles endpoint
// app.get('/fetch_parked_vehicles', async (req, res) => {
//   const { user_id } = req.query;

//   console.log('user_id in fetching dataaaaaaaaaaaaaaaa:');
//   try {
//     const getWardenId = `
//           SELECT warden_id 
//           FROM warden 
//           WHERE user_id = $1 ;
//         `;
//     const resultGetWardenId = await pool.query(getWardenId, [user_id]);
//     if (resultGetWardenId.rows.length === 0) {
//       return res.status(404).json({ message: 'Warden not found' });
//     }
//     const warden_id = resultGetWardenId.rows[0].warden_id;
//     console.log('warden_id of particular bla bla:', warden_id);

//     // const parkigInstances =await pool.query('SELECT * FROM parking_instance WHERE warden_id = $1 AND out_time is NULL' ,
//     //    [warden_id]);
//     const parkingInstancesQuery = `
//       SELECT * 
//       FROM parking_instance 
//       WHERE warden_id = $1 AND out_time IS NULL;
//     `;
//     const resultParkingInstances = await pool.query(parkingInstancesQuery, [warden_id]);
//     console.log('resultParkingInstances:', resultParkingInstances.rows);

//     if (resultParkingInstances.rows.length === 0) {
//       return res.status(404).json({ message: 'No parking instances found' });
//     }
//     res.json(resultParkingInstances.rows);
//   } catch (error) {
//     console.error('Error fetchinggggg data:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });


// app.get('/fetch_parked_vehicles', async (req, res) => {
//   const { user_id } = req.query;

//   try {
//     // Get warden_id from user_id
//     const getWardenId = `
//       SELECT warden_id 
//       FROM warden 
//       WHERE user_id = $1;
//     `;
//     const resultGetWardenId = await pool.query(getWardenId, [user_id]);
//     if (resultGetWardenId.rows.length === 0) {
//       return res.status(404).json({ message: 'Warden not found' });
//     }
//     const warden_id = resultGetWardenId.rows[0].warden_id;

//     // Fetch parking instances with vehicle details
//     const parkingInstancesQuery = `
//       SELECT 
//         pi.instance_id,
//         pi.in_time,
//         pi.out_time,
//         pi.toll_amount,
//         v.vehicle_number,
//         vt.type_name AS vehicle_type_name
//       FROM parking_instance pi
//       JOIN driver_vehicle dv ON pi.driver_vehicle_id = dv.driver_vehicle_id
//       JOIN vehicle v ON dv.vehicle_id = v.vehicle_id
//       JOIN vehicle_type vt ON v.type_id = vt.vehicle_type_id
//       WHERE pi.warden_id = $1 AND pi.out_time IS NULL
//        ORDER BY pi.in_time DESC;
//     `;
//     const resultParkingInstances = await pool.query(parkingInstancesQuery, [warden_id]);

//     if (resultParkingInstances.rows.length === 0) {
//       return res.status(404).json({ message: 'No parking instances found' });
//     }
//     res.json(resultParkingInstances.rows);
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });


app.get('/fetch_parked_vehicles', async (req, res) => {
  const { user_id } = req.query;

  console.log('user_id in fetching data:', user_id);
  try {
    // Get the warden_id from the user_id
    const getWardenId = `
      SELECT warden_id 
      FROM warden 
      WHERE user_id = $1;
    `;
    const resultGetWardenId = await pool.query(getWardenId, [user_id]);
    if (resultGetWardenId.rows.length === 0) {
      return res.status(404).json({ message: 'Warden not found' });
    }
    const warden_id = resultGetWardenId.rows[0].warden_id;
    console.log('warden_id:', warden_id);

    // Get the parked vehicles details
    const parkingInstancesQuery = `
      SELECT 
        pi.instance_id,
        pi.in_time,
        pi.out_time,
        pi.toll_amount,
        pi.transaction_id,
        pi.driver_vehicle_id,
        pi.slot_id,
        pi.lot_id,
        pi.warden_id,
        vt.type_name AS vehicle_type_name,
        v.vehicle_number,
        pl.name AS parking_lot_name,
        d.fname AS driver_fname,
        d.lname AS driver_lname,
        w.fname AS warden_fname,
        w.lname AS warden_lname
      FROM parking_instance pi
      JOIN driver_vehicle dv ON pi.driver_vehicle_id = dv.driver_vehicle_id
      JOIN vehicle v ON dv.vehicle_id = v.vehicle_id
      JOIN vehicle_type vt ON v.type_id = vt.vehicle_type_id
      JOIN parking_lot pl ON pi.lot_id = pl.lot_id
      JOIN driver d ON dv.driver_id = d.driver_id
      JOIN warden w ON pi.warden_id = w.warden_id
      WHERE pi.warden_id = $1 AND pi.out_time IS NULL
      ORDER BY pi.in_time DESC;
    `;
    const resultParkingInstances = await pool.query(parkingInstancesQuery, [warden_id]);
    console.log('resultParkingInstances:', resultParkingInstances.rows);

    if (resultParkingInstances.rows.length === 0) {
      return res.status(404).json({ message: 'No parking instances found' });
    }

    // Map the results to include full driver and warden names
    const response = resultParkingInstances.rows.map(instance => ({
      ...instance,
      driver_name: `${instance.driver_fname} ${instance.driver_lname}`,
      warden_name: `${instance.warden_fname} ${instance.warden_lname}`
    }));

    res.json(response);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



app.post('/exit-vehicle', async (req, res) => {
  const { instance_id, amount } = req.body;
  const out_time = new Date().toISOString(); // Convert to ISO 8601 format

  try {
    const query = `
      UPDATE parking_instance 
      SET out_time = $2, toll_amount = $3
      WHERE instance_id = $1
      RETURNING *;
    `;
    const values = [instance_id, out_time, amount];
    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      // Update vehicle and driver tables
      const instance = result.rows[0];
      await pool.query('UPDATE vehicle SET isparked = false WHERE vehicle_id = (SELECT vehicle_id FROM driver_vehicle WHERE driver_vehicle_id = $1)', [instance.driver_vehicle_id]);
      await pool.query('UPDATE driver SET isparked = false WHERE driver_id = (SELECT driver_id FROM driver_vehicle WHERE driver_vehicle_id = $1)', [instance.driver_vehicle_id]);

      res.status(200).json({ message: 'Vehicle exited successfully', data: result.rows[0] });
    } else {
      res.status(404).json({ error: 'Parking instance not found' });
    }
  } catch (error) {
    console.error('Error exiting vehicle:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Endpoint to get parking instance
app.get('/get-parking-instance/', async (req, res) => {
  const { vehicle_id, user_id } = req.params;

  try {
      const query = `
          SELECT pi.instance_id
          FROM parking_instance pi
          JOIN driver_vehicle dv ON pi.driver_vehicle_id = dv.driver_vehicle_id
          WHERE dv.vehicle_id = $1 AND dv.driver_id = $2 AND pi.out_time IS NULL;
      `;
      const values = [vehicle_id, user_id];
      const result = await pool.query(query, values);

      if (result.rows.length > 0) {
          res.json({ instance_id: result.rows[0].instance_id });
      } else {
          res.status(404).json({ message: 'No parking instance found' });
      }
  } catch (error) {
      console.error('Error fetching parking instance:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});



app.get('/get-warden-name/:user_id', async (req, res) => {
  const userId = req.params.user_id;
  try {
    const result = await pool.query('SELECT fname FROM warden WHERE user_id = $1', [userId]);
    if (result.rows.length > 0) {
      res.json({ wardenName: result.rows[0].fname });
    } else {
      res.json({ wardenName: null });
    }
  } catch (error) {
    console.error('Error fetching warden name:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// app.get('/exit-from-qr', async (req, res) => {
//   const { vehicle_id, driver_id , user_id } = req.query;
// console.log('in exit from qr vehicle id:',vehicle_id);
// console.log('in exit from qr driver id:',driver_id);
// // console.log('in exit from qr warden_user_id:',warden_user_id);

//   try {
//     console.log('in exit from qrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');

//     const driverVehicleQuery = `
//     SELECT driver_vehicle_id 
//     FROM driver_vehicle 
//     WHERE vehicle_id = $1 AND driver_id = $2;
//   `;

//     // Execute the query to get driver_vehicle_id
//     const result1 = await pool.query(driverVehicleQuery, [vehicle_id, driver_id]);
//     console.log('Query Result:', result1.rows);
//     const driver_vehicle_id = result1.rows[0].driver_vehicle_id;
//     console.log("driver_vehicle_iddddd",driver_vehicle_id); //done

//     //get warden id
//     const getWardenId = `
//       SELECT warden_id 
//       FROM warden 
//       WHERE user_id = $1;
//     `;
//     const resultGetWardenId = await pool.query(getWardenId, [user_id]);
//     if (resultGetWardenId.rows.length === 0) {
//       return res.status(404).json({ message: 'Warden not found' });
//     }
//     const warden_id = resultGetWardenId.rows[0].warden_id;
//     console.log('warden_id:', warden_id); //done

//     // Query to fetch details
//     const query = `
//       SELECT 
//         pi.instance_id,
//         pi.in_time,
//         pi.out_time,
//         pi.toll_amount,
//         pi.transaction_id,
//         pi.driver_vehicle_id,
//         pi.slot_id,
//         pi.lot_id,
//         pi.warden_id,
//         vt.type_name AS vehicle_type_name,
//         v.vehicle_number,
//         pl.name AS parking_lot_name,
//         d.fname AS driver_fname,
//         d.lname AS driver_lname,
//         w.fname AS warden_fname,
//         w.lname AS warden_lname
//       FROM parking_instance pi
//       JOIN driver_vehicle dv ON pi.driver_vehicle_id = dv.driver_vehicle_id
//       JOIN vehicle v ON dv.vehicle_id = v.vehicle_id
//       JOIN vehicle_type vt ON v.type_id = vt.vehicle_type_id
//       JOIN parking_lot pl ON pi.lot_id = pl.lot_id
//       JOIN driver d ON dv.driver_id = d.driver_id
//       JOIN warden w ON pi.warden_id = w.warden_id
//       WHERE pi.warden_id = $1 AND pi.out_time IS NULL
//       AND pi.driver_vehicle_id = $2;
//     `;

//     const result = await pool.query(query, [warden_id,driver_vehicle_id]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: 'No details found for the given driver_vehicle_id' });
//     }
// console.log('result.rowssssssssssssssssssssssssssssssssssssssssssssssssssssssss');
//     console.log('Query Result:', result.rows[0]);
//   // Map the results to include full driver and warden names
//   // const response = result.rows.map(instance => ({
//   //   ...instance,
//   //   driver_name: `${instance.driver_fname} ${instance.driver_lname}`,
//   //   warden_name: `${instance.warden_fname} ${instance.warden_lname}`
//   // }));
//   // res.json(response);
//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error('Error fetching vehicle details:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });




app.get('/exit-from-qr', async (req, res) => {
  const { vehicle_id, driver_id , user_id } = req.query;
console.log('in exit from qr vehicle id:',vehicle_id);
console.log('in exit from qr driver id:',driver_id);
// console.log('in exit from qr warden_user_id:',warden_user_id);

  try {
    console.log('in exit from qrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');

    const driverVehicleQuery = `
    SELECT driver_vehicle_id 
    FROM driver_vehicle 
    WHERE vehicle_id = $1 AND driver_id = $2;
  `;

    // Execute the query to get driver_vehicle_id
    const result1 = await pool.query(driverVehicleQuery, [vehicle_id, driver_id]);
    console.log('Query Result:', result1.rows);
    const driver_vehicle_id = result1.rows[0].driver_vehicle_id;
    console.log("driver_vehicle_iddddd",driver_vehicle_id); //done

    //get warden id
    const getWardenId = `
      SELECT warden_id 
      FROM warden 
      WHERE user_id = $1;
    `;
    const resultGetWardenId = await pool.query(getWardenId, [user_id]);
    if (resultGetWardenId.rows.length === 0) {
      return res.status(404).json({ message: 'Warden not found' });
    }
    const warden_id = resultGetWardenId.rows[0].warden_id;
    console.log('warden_id:', warden_id); //done

    // Query to fetch details
    const query = `
    SELECT 
      pi.instance_id,
      pi.in_time,
      pi.out_time,
      pi.toll_amount,
      pi.transaction_id,
      pi.driver_vehicle_id,
      pi.slot_id,
      pi.lot_id,
      pi.warden_id,
      vt.type_name AS vehicle_type_name,
      v.vehicle_number,
      pl.name AS parking_lot_name,
      CONCAT(d.fname, ' ', d.lname) AS driver_name, -- Concatenate driver first and last name
      CONCAT(w.fname, ' ', w.lname) AS warden_name  -- Concatenate warden first and last name
    FROM parking_instance pi
    JOIN driver_vehicle dv ON pi.driver_vehicle_id = dv.driver_vehicle_id
    JOIN vehicle v ON dv.vehicle_id = v.vehicle_id
    JOIN vehicle_type vt ON v.type_id = vt.vehicle_type_id
    JOIN parking_lot pl ON pi.lot_id = pl.lot_id
    JOIN driver d ON dv.driver_id = d.driver_id
    JOIN warden w ON pi.warden_id = w.warden_id
    WHERE pi.warden_id = $1 
      AND pi.out_time IS NULL
      AND pi.driver_vehicle_id = $2;
  `;
  
  const result = await pool.query(query, [warden_id, driver_vehicle_id]);

  console.log("magulaaaaa",result.rows)
  
  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'No details found for the given driver_vehicle_id' });
  }
  
  console.log('Query Result:', result.rows[0]);
  res.json(result.rows[0]);
  
  } catch (error) {
    console.error('Error fetching vehicle details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});







app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
