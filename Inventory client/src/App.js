import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

function App() {
  const [inventory, setInventory] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    fetch('/inventory')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setInventory(data);
        } else {
          console.error("Data returned from /inventory is not an array:", data);
        }
      })
      .catch(error => console.error(error));

    socket.on('inventory-update', (item) => {
      setInventory(prevInventory => {
        const updatedInventory = prevInventory.filter(i => i._id !== item._id);
        if (item.__v !== undefined) {
          updatedInventory.push(item); 
        }
        return updatedInventory; 
      });
    });

    return () => {
      socket.off('inventory-update');
    };
  }, []);

  const handleAddItem = async () => {
    const newItem = { name: name, description: 'A new item', quantity: 1 };
    try {
      const res = await fetch('/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (res.ok) {
        const data = await res.json();
        setInventory(prevInventory => [...prevInventory, data]);
        setName("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateItem = async (itemId, updates) => {
    try {
      const res = await fetch(`/inventory/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        setInventory(prevInventory => {
          const updatedInventory = prevInventory.filter(i => i._id !== data._id);
          updatedInventory.push(data);
          return updatedInventory;
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const res = await fetch(`/inventory/${itemId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const data = await res.json();
        setInventory(prevInventory => {
          return prevInventory.filter(i => i._id !== data._id);
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
    <h1>Inventory</h1>
    <input
      onChange={(e) => setName(e.target.value)}
      type="text"
      name="name"
      placeholder=" Item name"
      value={name}
    />
    <button onClick={handleAddItem}>Add Item</button>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Quantity</th>
          <th></th>
          </tr>
        </thead>
        <tbody>
          {inventory.map(item => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{item.quantity}</td>
              <td>
                <button onClick={() => handleUpdateItem(item._id, { quantity: item.quantity + 1 })}>+</button>
                <button onClick={() => handleUpdateItem(item._id, { quantity: item.quantity - 1 })}>-</button>
                <button onClick={() => handleDeleteItem(item._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>  
      </table>
    </div>
  );
}

export default App

