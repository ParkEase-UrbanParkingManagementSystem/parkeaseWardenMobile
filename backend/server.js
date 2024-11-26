const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./../db');
const router = express.Router();

const app = express();
app.use(bodyParser.json());

app.use(express.json());

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

router.post('/login', async (req, res) => {
    console.log('WardenApp login request received');  
    const { email, password } = req.body;
  
    try {
      const userQuery = 'SELECT * FROM users WHERE email = $1';
      const userResult = await pool.query(userQuery, [email]);
  
      if (userResult.rows.length === 0) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      const user = userResult.rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      if (user.role_id !== 3) {
        return res.status(403).json({ message: 'Unauthorized role' });
      }
  
      const tokenPayload = { userId: user.user_id };
      const token = jwt.sign(tokenPayload, process.env.jwtSecret, { expiresIn: '1h' });
  
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
    const decoded = jwt.verify(token, process.env.jwtSecret);
    console.log('Decoded Token:', decoded); // Log the decoded token
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error('Token error:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Test route to print warden ID
router.get('/test', authenticateToken, (req, res) => {
  console.log('Warden ID:', req.userId);
  res.json({ message: 'Warden ID logged in console', userId: req.userId });
});





// Check parking status endpoint
router.post('/check-parking-status', async (req, res) => {
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
router.post('/assign-parking', async (req, res) => {
  const { vehicle_id, driver_id, user_id,numberOfSlots } = req.body;
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

    //get the vehicle type id
    const getVehicleTypeId = `
      SELECT type_id 
      FROM vehicle 
      WHERE vehicle_id = $1;
    `;
    const resultGetVehicleTypeId = await pool.query(getVehicleTypeId, [vehicle_id]);

    const vehicle_type_id = resultGetVehicleTypeId.rows[0].type_id;
    console.log('vehicle_type_id:', vehicle_type_id);

    if (vehicle_type_id === 2) {
      const updateAvailableBikeslots = `
      UPDATE parking_lot SET bike_capacity_available = bike_capacity_available - $2 WHERE lot_id = $1;
      `;
      await pool.query(updateAvailableBikeslots, [lot_id , numberOfSlots]);
    }
    else{
      const updateAvailableCarslots = `
      UPDATE parking_lot SET car_capacity_available = car_capacity_available - $2 WHERE lot_id = $1;
      `;
      await pool.query(updateAvailableCarslots, [lot_id , numberOfSlots]);
    }


  //   const availableslots = `
  //   UPDATE driver SET isparked = true WHERE driver_id = $1;
  //   `;
  // await pool.query(updateDriverTable, [driver_id]);

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


router.get('/fetch_parked_vehicles', async (req, res) => {
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

    // Check if the warden is assigned to a parking lot
    const checkWardenAssignmentQuery = `
      SELECT EXISTS (
        SELECT 1 
        FROM warden_parking_lot 
        WHERE warden_id = $1
      ) AS is_assigned;
    `;
    const resultCheckWardenAssignment = await pool.query(checkWardenAssignmentQuery, [warden_id]);
    const is_assigned = resultCheckWardenAssignment.rows[0].is_assigned;
    console.log('is_assigned:', is_assigned);

    // Get the parked vehicles details
    const parkingInstancesQuery = `
      SELECT 
    pi.instance_id,
    pi.in_time,
    pi.out_time,
    pi.toll_amount,
    pi.method_id,
    pi.driver_vehicle_id,
    pi.lot_id,
    pi.warden_id,
    vt.type_name AS vehicle_type_name,
    vt.vehicle_type_id AS vehicle_type_id,
    v.vehicle_number,
    v.name,
    pl.name AS parking_lot_name,
    d.fname AS driver_fname,
    d.lname AS driver_lname,
    w.fname AS warden_fname,
    w.lname AS warden_lname,
    ta.amount_per_vehicle AS toll_amount
      FROM parking_instance pi
      JOIN driver_vehicle dv ON pi.driver_vehicle_id = dv.driver_vehicle_id
      JOIN vehicle v ON dv.vehicle_id = v.vehicle_id
      JOIN vehicle_type vt ON v.type_id = vt.vehicle_type_id
      JOIN parking_lot pl ON pi.lot_id = pl.lot_id
      JOIN driver d ON dv.driver_id = d.driver_id
      JOIN warden w ON pi.warden_id = w.warden_id
      JOIN toll_amount ta ON pi.lot_id = ta.lot_id AND vt.vehicle_type_id = ta.type_id
      WHERE pi.warden_id = $1 AND pi.out_time IS NULL
      ORDER BY pi.in_time DESC;

    `;
    const resultParkingInstances = await pool.query(parkingInstancesQuery, [warden_id]);
    console.log('resultParkingInstances:', resultParkingInstances.rows);

    if (resultParkingInstances.rows.length === 0) {
      console.log('No parking instances found');
      return res.status(200).json({ message: 'No parking instances found', is_assigned, parked_vehicles: [] });
    }

    // Map the results to include full driver and warden names
    const response = resultParkingInstances.rows.map(instance => ({
      ...instance,
      driver_name: `${instance.driver_fname} ${instance.driver_lname}`,
      warden_name: `${instance.warden_fname} ${instance.warden_lname}`
    }));

    res.json({ is_assigned, parked_vehicles: response });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/fetch_available_slots', async (req, res) => {
  console.log('user_id in fetching availableeeee Badu awaaaaaaa:');
  const { user_id } = req.query;
  try{
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

    const getLotId = `
      SELECT lot_id from warden_parking_lot where warden_id = $1;`;
    const resultGetLotId = await pool.query(getLotId, [warden_id]);
    if (resultGetLotId.rows.length === 0) {
      return res.status(404).json({ message: 'Lot not found' });
    }
    const lot_id = resultGetLotId.rows[0].lot_id;

    const getAvailableSlots = `
      SELECT car_capacity_available, bike_capacity_available
      FROM parking_lot
      WHERE lot_id = $1;`;
      
    const resultGetAvailableSlots = await pool.query(getAvailableSlots, [lot_id]);
    if (resultGetAvailableSlots.rows.length === 0) {
      return res.status(404).json({ message: 'No available slots found' });
    }
    console.log('resultGetAvailableSlotssssssssssssssssssssssssssssssssssssssssssss:', resultGetAvailableSlots.rows[0]);
    res.json(resultGetAvailableSlots.rows[0]);

  }catch(error){
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/update_slots', async (req, res) => {
  const { user_id, carSlots, bikeSlots } = req.body;
  console.log('user_id in update slots:', user_id);
  console.log("number of carssss #######################################################",carSlots);
  console.log("number of carssss #######################################################",bikeSlots);

  try{
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

  const getLotId = `
    SELECT lot_id from warden_parking_lot where warden_id = $1;`;
  const resultGetLotId = await pool.query(getLotId, [warden_id]);
  if (resultGetLotId.rows.length === 0) {
    return res.status(404).json({ message: 'Lot not found' });
  }
  const lot_id = resultGetLotId.rows[0].lot_id;

  const updateSlots = `
    UPDATE parking_lot
    SET car_capacity_available = $1, bike_capacity_available = $2
    where lot_id = $3;
    `;
  await pool.query(updateSlots, [carSlots, bikeSlots, lot_id]);
  res.status(200).json({ message: 'Slots updated successfully' });

  }catch(error){
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});





router.post('/exit-vehicle', async (req, res) => {
  const { instance_id, amount ,vehicle_type_id,lot_id} = req.body;
  const out_time = new Date().toISOString(); // Convert to ISO 8601 format

  try {
  //   const query = `
  //     UPDATE parking_instance 
  //     SET out_time = $2, toll_amount = $3
  //     WHERE instance_id = $1
  //     RETURNING *;
  //   `;
  //   const values = [instance_id, out_time, amount];
  const query = `
  UPDATE parking_instance 
  SET out_time = NOW(), toll_amount = $2
  WHERE instance_id = $1
  RETURNING *;
`;
const values = [instance_id, amount]; // No need to pass `out_time` from JavaScript

    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      // Update vehicle and driver tables
      const instance = result.rows[0];
      await pool.query('UPDATE vehicle SET isparked = false WHERE vehicle_id = (SELECT vehicle_id FROM driver_vehicle WHERE driver_vehicle_id = $1)', [instance.driver_vehicle_id]);
      await pool.query('UPDATE driver SET isparked = false WHERE driver_id = (SELECT driver_id FROM driver_vehicle WHERE driver_vehicle_id = $1)', [instance.driver_vehicle_id]);


            // Update parking_lot capacity
            if (vehicle_type_id === 2) {
              // Increment bike capacity
              await pool.query(
                'UPDATE parking_lot SET bike_capacity_available = bike_capacity_available + 1 WHERE lot_id = $1',
                [lot_id]
              );
            } else {
              // Increment car capacity
              await pool.query(
                'UPDATE parking_lot SET car_capacity_available = car_capacity_available + 1 WHERE lot_id = $1',
                [lot_id]
              );
            }

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
router.get('/get-parking-instance/', async (req, res) => {
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

//fetchPersonalInfo endpoint
router.get('/fetchPersonalInfo', async (req, res) => {
  const  {user_id}  = req.query;
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

    //fetch from warden table
    const fetchWardenTable = `
    select
    fname as warden_fname,
    lname as warden_lname,
    nic as warden_nic,
    age as warden_age,
    gender as gender
    from warden
    where warden_id = $1;`;

    const resultFetchWardenTable = await pool.query(fetchWardenTable, [warden_id]);
    if (resultFetchWardenTable.rows.length === 0) {
        return res.status(404).json({ message: 'Warden not found' });
    }
    const warden_details1 = resultFetchWardenTable.rows[0];

    //fetch fromuser table
    const fetchUserTable = `
    select
    email as email,
    addressno as addressno,
    street_1 as street_1,
    street_2 as street_2,
    city as city,
    province as province,
    contact as contactno
    from users
    where user_id = $1;`;

    const resultFetchUserTable = await pool.query(fetchUserTable, [user_id]);
    if (resultFetchUserTable.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
    }
    const warden_details2 = resultFetchUserTable.rows[0];

      const response = {
        warden_details1: warden_details1,
        warden_details2: warden_details2
      };
      console.log('responseeeeeeeeeeeepersonallllllllllllllllll', response);
      res.json(response);
      
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//fetchWorkingInfo endpoint
router.get('/fetchWorkingInfo', async (req, res) => {
  const  {user_id}  = req.query;
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

    //get pmc id
      const getPmcId = `
      SELECT pmc_id
      FROM warden 
      WHERE user_id = $1;`;
      const resultGetPmcId = await pool.query(getPmcId, [user_id]);
      if (resultGetPmcId.rows.length === 0) {
        return res.status(404).json({ message: 'Pmc not found' });
      }
      const pmc_id = resultGetPmcId.rows[0].pmc_id;

      //get pmc name
      const getPmcName = `
      SELECT name
      FROM pmc 
      WHERE pmc_id = $1;`;
      const resultGetPmcName = await pool.query(getPmcName, [pmc_id]);
      if (resultGetPmcName.rows.length === 0) {
          return res.status(404).json({ message: 'Pmc not found' });
      }
      const pmc_name = resultGetPmcName.rows[0].name;

      //get parking lot id
      const getParkingLotId = `
      select lot_id 
      from warden_parking_lot
      where warden_id = $1;`;
      const resultGetParkingLotId = await pool.query(getParkingLotId, [warden_id]);
      if (resultGetParkingLotId.rows.length === 0) {
          return res.status(404).json({ message: 'Parking lot not found' });
      }
      const lot_id = resultGetParkingLotId.rows[0].lot_id;
  

      //get parking lot name
      //column loacation dropped
      const getParkingLotDetails = `
      SELECT 
      name as parking_lot_name,
      bike_capacity as bike_capacity,
      tw_capacity as tw_capacity,
      car_capacity as car_capacity,
      xlvehicle_capacity as xlvehicle_capacity,
      full_capacity as full_capacity,
      addressno as lot_addressno,
      street1 as lot_street1,
      street2 as lot_street2,
      city as lot_city,
      district as lot_district,
      description as lot_description
      from parking_lot
      WHERE lot_id = $1;`;

      const resultGetParkingLotDetails = await pool.query(getParkingLotDetails, [lot_id]);
      if (resultGetParkingLotDetails.rows.length === 0) {
          return res.status(404).json({ message: 'Parking lot not found' });
      }
      const parking_lot_details = resultGetParkingLotDetails.rows[0];
      // console.log('parking_lot_detailsssssssssss:', parking_lot_details);


      const response = {
          pmc_name: pmc_name,
          parking_lot_details: parking_lot_details
      };
      // console.log('responseeeeeeeeeeee', response);
      res.json(response);
      
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



router.get('/get-warden-name/:user_id', async (req, res) => {
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
//         pi.method_id,
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




router.get('/exit-from-qr', async (req, res) => {
  const { vehicle_id, driver_id , user_id } = req.query;
console.log('in exit from qr vehicle id:',vehicle_id);
console.log('in exit from qr driver id:',driver_id);
// console.log('in exit from qr warden_user_id:',warden_user_id);

  try {
    console.log('in exit from qrrrrr');

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
      pi.method_id,
      pi.driver_vehicle_id,
      
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




//updated fetchInsight endpoint

router.get('/fetch_insights', async (req, res) => {
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

    // Check if the warden is assigned to a parking lot and get the lot_id
    const getLotIdQuery = `
      SELECT wpl.lot_id, pl.name AS parking_lot_name, pl.car_capacity, pl.bike_capacity, 
             pl.car_capacity_available, pl.bike_capacity_available
      FROM warden_parking_lot wpl
      JOIN parking_lot pl ON wpl.lot_id = pl.lot_id
      WHERE wpl.warden_id = $1;
    `;
    const resultLotInfo = await pool.query(getLotIdQuery, [warden_id]);
    
    if (resultLotInfo.rows.length === 0) {
      console.log('Warden is not assigned to any parking lot');
      return res.status(200).json({ message: 'Warden is not assigned to any parking lot', is_assigned: false });
    }

    const lotInfo = resultLotInfo.rows[0];
    const lotId = lotInfo.lot_id;
    console.log('lot_id:', lotId);

    // Get cash revenue
    const cashRevenueQuery = `
      SELECT SUM(toll_amount) AS cash_revenue
      FROM parking_instance 
      WHERE method_id = 2
      AND warden_id = $1 
      AND lot_id = $2 
      AND DATE(out_time) = CURRENT_DATE 
      AND out_time IS NOT NULL;
    `;
    const resultCashRevenue = await pool.query(cashRevenueQuery, [warden_id, lotId]);
    const cashRevenue = resultCashRevenue.rows[0].cash_revenue || 0;

// Get wallet revenue
const walletRevenueQuery = `
  SELECT SUM(toll_amount) AS wallet_revenue
  FROM parking_instance 
  WHERE method_id = 1
  AND warden_id = $1 
  AND lot_id = $2 
  AND DATE(out_time) = CURRENT_DATE 
  AND out_time IS NOT NULL;
`;

    const resultWalletRevenue = await pool.query(walletRevenueQuery, [warden_id, lotId]);
    const walletRevenue = resultWalletRevenue.rows[0].wallet_revenue || 0;

    // Prepare the response
    const response = {
      is_assigned: true,
      lot_name: lotInfo.parking_lot_name,
      total_slots: {
        car: lotInfo.car_capacity,
        bike: lotInfo.bike_capacity
      },
      available_slots: {
        car: lotInfo.car_capacity_available,
        bike: lotInfo.bike_capacity_available
      },
      cash_revenue: cashRevenue,
      wallet_revenue: walletRevenue
    };

    console.log(response)
    res.json(response);

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// updated release vehicle
router.post('/release-vehicle', async (req, res) => {
  const { instance_id, amount ,vehicle_type_id,lot_id} = req.body;
  const out_time = new Date().toISOString(); // Convert to ISO 8601 format

  try {
  //   const query = `
  //     UPDATE parking_instance 
  //     SET out_time = $2, toll_amount = $3
  //     WHERE instance_id = $1
  //     RETURNING *;
  //   `;
  //   const values = [instance_id, out_time, amount];
  const query = `
  UPDATE parking_instance 
  SET out_time = NOW(), toll_amount = $2, method_id=4
  WHERE instance_id = $1
  RETURNING *;
`;
const values = [instance_id, amount]; // No need to pass `out_time` from JavaScript

    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      // Update vehicle and driver tables
      const instance = result.rows[0];
      await pool.query('UPDATE vehicle SET isparked = false WHERE vehicle_id = (SELECT vehicle_id FROM driver_vehicle WHERE driver_vehicle_id = $1)', [instance.driver_vehicle_id]);
      await pool.query('UPDATE driver SET isparked = false WHERE driver_id = (SELECT driver_id FROM driver_vehicle WHERE driver_vehicle_id = $1)', [instance.driver_vehicle_id]);


            // Update parking_lot capacity
            if (vehicle_type_id === 2) {
              // Increment bike capacity
              await pool.query(
                'UPDATE parking_lot SET bike_capacity_available = bike_capacity_available + 1 WHERE lot_id = $1',
                [lot_id]
              );
            } else {
              // Increment car capacity
              await pool.query(
                'UPDATE parking_lot SET car_capacity_available = car_capacity_available + 1 WHERE lot_id = $1',
                [lot_id]
              );
            }

      res.status(200).json({ message: 'Vehicle exited successfully', data: result.rows[0] });
    } else {
      res.status(404).json({ error: 'Parking instance not found' });
    }
  } catch (error) {
    console.error('Error exiting vehicle:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// updated fetch history - list
router.get('/fetch_history_list', async (req, res) => {
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

    // Check if the warden is assigned to a parking lot
    const checkWardenAssignmentQuery = `
      SELECT EXISTS (
        SELECT 1 
        FROM warden_parking_lot 
        WHERE warden_id = $1
      ) AS is_assigned;
    `;
    const resultCheckWardenAssignment = await pool.query(checkWardenAssignmentQuery, [warden_id]);
    const is_assigned = resultCheckWardenAssignment.rows[0].is_assigned;
    console.log('is_assigned:', is_assigned);

    //get the parkinglot id (check the date)
    const getLotId=`
      SELECT lot_id
      FROM warden_parking_lot
      WHERE warden_id = $1;
    `
    const resultGetLotId = await pool.query(getLotId, [warden_id]);
    const lotId= resultGetLotId.rows[0].lot_id;



    const parkingHistoryQuery=`
        SELECT 
    pi.instance_id,
    pi.in_time,
    pi.out_time,
    pi.toll_amount,
    pi.method_id,
    pi.driver_vehicle_id,
    dv.vehicle_id,
    dv.driver_id,
    d.fname AS driver_fname,
    d.lname AS driver_lname,
    v.vehicle_number,
    v.type_id,
    vt.type_name AS vehicle_type_name,
    pm.name AS payment_method_name,
    w.fname AS warden_fname,
    w.lname AS warden_lname,
    pl.name
    From parking_instance pi
    JOIN driver_vehicle dv ON pi.driver_vehicle_id = dv.driver_vehicle_id
    JOIN driver d ON dv.driver_id = d.driver_id
    JOIN vehicle v ON dv.vehicle_id = v.vehicle_id
    JOIN vehicle_type vt ON v.type_id = vt.vehicle_type_id
    JOIN payment_method pm ON pi.method_id = pm.method_id
    JOIN warden w ON pi.warden_id = w.warden_id
    JOIN parking_lot pl ON pi.lot_id = pl.lot_id

    WHERE pi.lot_id = $1 AND pi.warden_id =$2 AND pi.out_time IS NOT NULL;
    `
    const resultParkingHistory = await pool.query(parkingHistoryQuery, [lotId,warden_id]);
    console.log('resultParkingHistory:', resultParkingHistory.rows);


    if (resultParkingHistory.rows.length === 0) {
      console.log('No parking history found');
      return res.status(200).json({ message: 'No parking instances found', is_assigned, parked_vehicles: [] });
    }

    // Map the results to include full driver and warden names
    const response = resultParkingHistory.rows.map(instance => ({
      ...instance,
      driver_name: `${instance.driver_fname} ${instance.driver_lname}`,
      warden_name: `${instance.warden_fname} ${instance.warden_lname}`
    }));

    res.json({ is_assigned, parked_vehicles: response });
    console.log('response',response);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



module.exports = router;