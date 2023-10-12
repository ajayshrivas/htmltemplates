import React, { useState } from 'react';
import './App.css';

function App() {

  const [selectedGender, setSelectedGender] = useState('male');
  const [selectedValue, setSelectedValue] = useState('');
  const [hobbies, setHobbies] = useState([]);
  const [image, setImage] = useState({ preview: '', data: '' })
  //const [status, setStatus] = useState('')

    const handleGenderChange = (e) => {
      setSelectedGender(e.target.value);
    };
    console.log(selectedGender);

    const handleCheckboxChange = (event) => {
      const { value, checked } = event.target;
      if (checked) {
        setHobbies([...hobbies, value]);
      } else {
        setHobbies(hobbies.filter((hobby) => hobby !== value));
      }
    };
    console.log(hobbies);

    const handleSelectChange = (event) => {
      const value = event.target.value;
      setSelectedValue(value);
    };
    console.log(selectedValue);
    const handleFileChange = (event) => {
      const img = {
        preview: URL.createObjectURL(event.target.files[0]),
        data: event.target.files[0],
      }
      setImage(img) 
      /*const selectedFile = event.target.files[0];
      if (selectedFile) {
        // Read the selected file as a Data URL
        const reader = new FileReader();
        reader.onload = (e) => {
          setFile(e.target.result);
          //console.log(e.target.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setFile(null);
      }*/
    }; 

    const handleSubmit = (e) => {
      e.preventDefault();
    
      // Create a new FormData object and append form fields to it
      const formDatas = new FormData();
      formDatas.append('selectedGender', selectedGender);
      formDatas.append('selectedValue', selectedValue);
      //formDatas.append('image', file);
      formDatas.append('image', image.data)
      formDatas.append('hobbies', hobbies); 
      // Append each hobby as a separate field (if you want to send them individually)
      // Create a POST request with the FormData object
      fetch('http://192.168.29.23:8000/upload', {
        method: 'POST',
        body: formDatas, // Send the FormData object as the request body
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the response data here (e.g., show a success message)
          console.log(data);
          //let result = JSON.parse(data);
          if(data.status===true){
            document.getElementById('message').style='background:green';
          }else{
            document.getElementById('message').style='background:red';
          }
          document.getElementById('message').innerHTML=data.message;

        })
        .catch((error) => {
          // Handle any errors here
          console.error(error);
        });
    };
    
 return ( 
    <div className="App">
      <h2>Gender Selection</h2>
      <div id="message"></div>
      <form onSubmit={handleSubmit} id="Testing" method="post" enctype="multipart/form-data">
        <label>
          <input
            type="radio"
            value="male"
            checked={selectedGender === 'male'}
            onChange={handleGenderChange}
          />
          Male
        </label>
        <label>
          <input
            type="radio"
            value="female"
            checked={selectedGender === 'female'}
            onChange={handleGenderChange}
          />
          Female
        </label>
        <label>
          <input
            type="radio"
            value="other"
            checked={selectedGender === 'other'}
            onChange={handleGenderChange}
          />
          Other
        </label>
        <label>
        <input
          type="checkbox"
          name="hobby"
          value="Reading"
          checked={hobbies.includes('Reading')}
          onChange={handleCheckboxChange}
        />
        Reading
      </label>
      <label>
        <input
          type="checkbox"
          name="hobby"
          value="Gaming"
          checked={hobbies.includes('Gaming')}
          onChange={handleCheckboxChange}
        />
        Gaming 
      </label>
        {/* Add more checkboxes for other hobbies */}
      <p>Selected Gender: {selectedGender}</p>
      <h2>Select Example</h2>
      <select value={selectedValue} onChange={handleSelectChange}>
        <option value="">Select an option</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </select>
      <p>Selected Value: {selectedValue}</p>
      <h2>File Upload and View</h2>
      <input type="file" name="file_image" accept="image/*" onChange={handleFileChange} />
      {image.preview && (
        <div>
          <h3>Uploaded Image:</h3>
          <img src={image.preview} alt="Uploaded" width="300" />
        </div>
      )}
       <button type="submit">Submit</button>
      </form>
    </div>
  );
}
export default App;