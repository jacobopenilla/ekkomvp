import { collection, addDoc, serverTimestamp, writeBatch, doc } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Assuming you have a firebaseConfig.js file

const seedFirestore = async () => {
  const batch = writeBatch(db);

  // --- MOCK ENTREPRENEURS ---
  const entrepreneursData = [
    {
      name: 'La Pizzería de Don Juan',
      bio: 'Las mejores pizzas con la receta tradicional de la nonna. Ingredientes frescos y masa artesanal.',
      deliveryType: 'delivery',
      location: { lat: 19.4326, lng: -99.1332 }, // Mexico City Zocalo
      nequiLink: 'https://nequi.com/pagar/123456789', // Example link
      bancoLink: 'https://bancolombia.com/pagar/987654321', // Example link
      products: [
        { title: 'Pizza Margherita', price: 150.00, description: 'Clásica y deliciosa, con tomate, mozzarella y albahaca.', imageUrl: 'https://via.placeholder.com/150' },
        { title: 'Pizza Pepperoni', price: 170.00, description: 'La favorita de todos, con pepperoni de alta calidad.', imageUrl: 'https://via.placeholder.com/150' },
        { title: 'Pizza Hawaiana', price: 165.00, description: 'Para los que aman la combinación de piña y jamón.', imageUrl: 'https://via.placeholder.com/150' }
      ]
    },
    {
      name: 'Repostería Dulce Encanto',
      bio: 'Pasteles, galletas y postres hechos con amor. Endulza tu día con nosotros.',
      deliveryType: 'pickup',
      location: { lat: 19.4285, lng: -99.1653 }, // Angel de la Independencia
      nequiLink: 'https://nequi.com/pagar/1122334455', // Example link
      bancoLink: null, // No Bancolombia link for this one
      products: [
        { title: 'Pastel de Chocolate', price: 350.00, description: 'Intenso sabor a chocolate, perfecto para celebraciones.', imageUrl: 'https://via.placeholder.com/150' },
        { title: 'Galletas de Chispas', price: 120.00, description: 'Una docena de galletas recién horneadas.', imageUrl: 'https://via.placeholder.com/150' },
        { title: 'Cheesecake de Fresa', price: 300.00, description: 'Cremoso y con una cubierta de fresas frescas.', imageUrl: 'https://via.placeholder.com/150' }
      ]
    },
    {
      name: 'Tacos El Güero',
      bio: 'Auténticos tacos al pastor y de bistec. El verdadero sabor de México en cada bocado.',
      deliveryType: 'delivery',
      location: { lat: 19.3907, lng: -99.1436 }, // Coyoacán
      nequiLink: null, // No Nequi link
      bancoLink: 'https://bancolombia.com/pagar/5566778899', // Example link
      products: [
        { title: 'Orden de Tacos al Pastor', price: 85.00, description: '5 tacos con su piña, cilantro y cebolla.', imageUrl: 'https://via.placeholder.com/150' },
        { title: 'Orden de Tacos de Bistec', price: 95.00, description: '5 tacos de jugoso bistec de res.', imageUrl: 'https://via.placeholder.com/150' },
        { title: 'Gringa al Pastor', price: 60.00, description: 'Queso derretido y carne al pastor en tortilla de harina.', imageUrl: 'https://via.placeholder.com/150' }
      ]
    }
  ];

  const entrepreneurRefs = [];
  console.log('Seeding entrepreneurs...');
  for (const entrepreneur of entrepreneursData) {
    const newEntrepRef = doc(collection(db, 'entrepreneurs'));
    batch.set(newEntrepRef, entrepreneur);
    entrepreneurRefs.push(newEntrepRef);
  }
  console.log('Entrepreneurs added to batch.');

  // --- MOCK USERS ---
  const usersData = [
    { name: 'Ana García', email: 'ana@example.com', role: 'client', location: { lat: 19.4194, lng: -99.1600 } },
    { name: 'Carlos Rodríguez', email: 'carlos@example.com', role: 'client', location: { lat: 19.4000, lng: -99.1700 } }
  ];

  const userRefs = [];
  console.log('Seeding users...');
  for (const user of usersData) {
    const newUserRef = doc(collection(db, 'users'));
    batch.set(newUserRef, user);
    userRefs.push(newUserRef);
  }
  console.log('Users added to batch.');

  // --- MOCK ORDERS ---
  const ordersData = [
    // Order 1: Ana -> La Pizzería de Don Juan
    {
      userId: 0, // Index for userRefs
      entrepreneurId: 0, // Index for entrepreneurRefs
      items: [entrepreneursData[0].products[0], entrepreneursData[0].products[1]],
      total: entrepreneursData[0].products[0].price + entrepreneursData[0].products[1].price,
      status: 'pending'
    },
    // Order 2: Carlos -> Tacos El Güero
    {
      userId: 1,
      entrepreneurId: 2,
      items: [entrepreneursData[2].products[0]],
      total: entrepreneursData[2].products[0].price,
      status: 'pending'
    },
    // Order 3: Ana -> Repostería Dulce Encanto
    {
      userId: 0,
      entrepreneurId: 1,
      items: [entrepreneursData[1].products[2]],
      total: entrepreneursData[1].products[2].price,
      status: 'pending'
    }
  ];
  
  console.log('Seeding orders...');
  for (const order of ordersData) {
    const newOrderRef = doc(collection(db, 'orders'));
    batch.set(newOrderRef, {
      userId: userRefs[order.userId].id,
      entrepreneurId: entrepreneurRefs[order.entrepreneurId].id,
      items: order.items,
      total: order.total,
      status: order.status,
      timestamp: serverTimestamp()
    });
  }
  console.log('Orders added to batch.');

  // --- COMMIT BATCH ---
  try {
    await batch.commit();
    console.log('Firestore seeded successfully!');
    entrepreneurRefs.forEach((ref, i) => console.log(`  -> Created entrepreneur ${i + 1} with ID: ${ref.id}`));
    userRefs.forEach((ref, i) => console.log(`  -> Created user ${i + 1} with ID: ${ref.id}`));
    console.log('  -> Created 3 sample orders.');
  } catch (error) {
    console.error('Error seeding Firestore: ', error);
  }
};

export default seedFirestore;
