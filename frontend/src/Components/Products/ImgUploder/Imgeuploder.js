import axios from 'axios';
import React, { useEffect, useState } from 'react';

function ImageUploader() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState(''); // Auto-generated name
  const [price, setPrice] = useState('');
  const [allImages, setAllImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const productMapping = {
    'cheese.jpg': 'Cheese ',
    'butter.jpg': 'Butter',
    'yoghur.jpg': 'Yoghurt',
    'fresh.jpg': 'Fresh Milk',
    'egg.jpg': 'Egg',
    'Meetbolle.jpg': 'Meeat bolle',
    'beef.jpg': 'Beef',
    'chicken.jpg': 'Chicken',
    'pork.jpg': 'Pork',
    'coconut.jpg': 'Coconut',
    'tea.jpg': 'Tea',
    'Cocova.jpg': 'Cocova',
  };

  const prices = {
    'Cheese ': 850,
    'Butter ': 500,
    'Yoghurt': 50,
    'Fresh Milk ': 450,
    'Egg ': 25,
    'Meeat bolle': 220,
    'Beef ': 2600,
    'Chicken ': 900,
    'Pork': 2700,
    'Coconut': 70,
    'Tea': 280,
    'Cocova': 350,
  };

  const submitImg = async (e) => {
    e.preventDefault();
    if (!image || !price) {
      setErrorMessage('Please select an image and provide a price.');
      return;
    }

    const resizedImage = await resizeImage(image, 200, 200); // Resize to 200x200

    const formData = new FormData();
    formData.append('image', resizedImage);
    formData.append('name', name);
    formData.append('price', price);

    try {
      await axios.post('http://localhost:5000/uploadImage', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImage(null);
      setName('');
      setPrice('');
      setErrorMessage('');
      setSuccessMessage('Image uploaded successfully!');
      getImages();
    } catch (error) {
      console.error('Error uploading image', error);
      setErrorMessage('Error uploading image. Please try again.');
    }
  };

  const getImages = async () => {
    try {
      const result = await axios.get('http://localhost:5000/getImage');
      setAllImages(result.data.data);
    } catch (error) {
      console.error('Error getting images', error);
      setErrorMessage('Error fetching images. Please try again later.');
    }
  };

  const deleteImage = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/deleteImage/${id}`);
      setSuccessMessage('Image deleted successfully!');
      getImages();
    } catch (error) {
      console.error('Error deleting image', error);
      setErrorMessage('Error deleting image. Please try again.');
    }
  };

  const onImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setImage(selectedFile);
      const fileName = selectedFile.name.toLowerCase();
      const generatedName = productMapping[fileName] || 'Image';
      setName(generatedName);
      setPrice(prices[generatedName] || '');
    }
  };

  useEffect(() => {
    getImages();
  }, []);

  const handleImageClick = (imageData) => {
    setSelectedImage(imageData);
  };

  const closeImagePopup = () => {
    setSelectedImage(null);
  };

  const handleNameChange = (event) => {
    const selectedName = event.target.value;
    setName(selectedName);
    setPrice(prices[selectedName] || '');
  };

  // Function to resize the image
  const resizeImage = (file, maxWidth, maxHeight) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate new dimensions while preserving aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert the canvas to a Blob and resolve the promise
        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, { type: file.type }));
        }, file.type);
      };
    });
  };

  const styles = {
    container: {
      textAlign: 'center',
      margin: '0px',
    },
    errorMessage: {
      color: 'red',
      marginBottom: '10px',
    },
    successMessage: {
      color: 'green',
      marginBottom: '10px',
    },
    uploadContainer: {
      border: '1px solid #ccc',
      borderRadius: '10px',
      padding: '20px',
      marginBottom: '20px',
      backgroundColor: '#f9f9f9',
    },
    select: {
      padding: '10px',
      margin: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      fontSize: '16px',
      width: '200px',
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#900C3F',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
      margin: '10px 0',
    },
    imageContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginTop: '20px',
    },
    imageCard: {
      margin: '10px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      width: '200px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'transform 0.2s',
    },
    image: {
      maxWidth: '100%',
      height: '200px', // Set a fixed height
      objectFit: 'cover', // Maintain aspect ratio and cover the area
      borderTopLeftRadius: '5px',
      borderTopRightRadius: '5px',
    },
    imageDetails: {
      padding: '10px',
    },
    popupContent: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0,0,0,0.5)',
      zIndex: '1000',
    },
    closePopup: {
      cursor: 'pointer',
      fontSize: '20px',
      position: 'absolute',
      top: '10px',
      right: '10px',
    },
  };

  return (
    <div style={styles.container}>
      <center>
        <h1>Image Uploader</h1>
        {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
        {successMessage && <p style={styles.successMessage}>{successMessage}</p>}
        
        {/* Upload Form Container */}
        <div style={styles.uploadContainer}>
          <input
            type="file"
            accept="image/*"
            onChange={onImageChange}
            className="user-box"
            style={{ marginBottom: '10px' }}
          />
          <div className="name-row">
            <label>Select Product Name:</label>
            <select onChange={handleNameChange} value={name} style={styles.select}>
              <option value="">Select a product</option>
              {Object.values(productMapping).map((product) => (
                <option key={product} value={product}>
                  {product}
                </option>
              ))}
            </select>
          </div>
          <div className="price-row">
            <label>Select Price:</label>
            <select onChange={(e) => setPrice(e.target.value)} value={price} style={styles.select}>
              <option value="">Select a price</option>
              {Object.entries(prices).map(([product, price]) => (
                <option key={product} value={price}>
                  Rs.{price} - {product}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="button" onClick={submitImg} style={styles.button}>
            Upload
          </button>
        </div>
      </center>

      {/* Image Gallery */}
      <div style={styles.imageContainer}>
        {allImages.map((imageData) => (
          <div key={imageData._id} style={styles.imageCard} onClick={() => handleImageClick(imageData)}>
            <img src={`http://localhost:5000/uploads/${imageData.image}`} alt={imageData.name} style={styles.image} />
            <div style={styles.imageDetails}>
              <h3>{imageData.name}</h3>
              <p>Price: Rs.{imageData.price}</p>
              <button onClick={() => deleteImage(imageData._id)} style={styles.button}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Image Popup */}
      {selectedImage && (
        <div style={styles.popupContent}>
          <span style={styles.closePopup} onClick={closeImagePopup}>✖</span>
          <h2>{selectedImage.name}</h2>
          <img src={`http://localhost:5000/uploads/${selectedImage.image}`} alt={selectedImage.name} style={{ maxWidth: '100%', height: 'auto' }} />
          <p>Price: Rs.{selectedImage.price}</p>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
