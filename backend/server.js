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

const PORT = process.env.PORT || 5000;

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
  const { vehicle_id, driver_id ,user_id} = req.body;
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

    res.status(200).json({ message: 'Parking slot assigned successfully' });
  } catch (error) {
    console.error('Error assigning parking slot:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
