import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Admin = () => {
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    technologies: '',
    image: '', // Base64 image data will be stored here
    link: '',
  });
  const [projects, setProjects] = useState([]);

  // Fetch projects from the backend
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/projects')
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error('Error fetching projects:', error));
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProject((prevState) => ({
          ...prevState,
          image: reader.result.split(",")[1], // Remove the metadata prefix from Base64
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  
  // Inside your JSX form input
  <input
    type="file"
    name="image"    
    onChange={handleImageChange}
  />
  

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Send the data to your Flask backend API
    fetch('http://127.0.0.1:5000/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProject),
    })
      .then((response) => response.json())
      .then((data) => {
        setProjects((prevProjects) => [...prevProjects, { id: data.id, ...newProject }]); // Add new project to state
        setNewProject({ name: '', technologies: '', image: '', link: '' }); // Reset the form inputs
        setShowModal(false); // Close the modal
      })
      .catch((error) => {
        console.error('Error adding project:', error);
      });
  };

  // Handle project deletion
  const handleDelete = (projectId) => {
    fetch(`http://127.0.0.1:5000/api/projects/${projectId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          setProjects((prevProjects) => prevProjects.filter((project) => project.id !== projectId)); // Remove the deleted project from state
        }
      })
      .catch((error) => {
        console.error('Error deleting project:', error);
      });
  };

  return (
    <div className="h-screen bg-black text-white py-20" id="admin">
              <Link to="/" className="absolute top-4 left-4 bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 text-transparent transform transition-transform duration-300 hover:scale-105 px-4 py-2 rounded-full">
        <span className="text-2xl mr-2">{"<"}</span> 
        <span className="text-base">Return Home</span>
      </Link>
      <div className="container mx-auto px-8 md:px-16 lg:px-24">
        <h2 className="text-4xl font-bold text-center mb-12">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Map through the projects to create the project cards */}
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-gray-800 p-6 rounded-lg hover:shadow-lg transform transition-transform duration-300 hover:scale-105 relative"
            >
              {/* Delete Button */}
              <button
                onClick={() => handleDelete(project.id)}
                className="animate-tremor w-10 h-10 rounded-full absolute top-2 right-2 bg-red-500 text-white p-2 hover:bg-red-700 transition-transform duration-300"
              >
                ✕
              </button>
              <img
                  src={`data:image/jpeg;base64,${project.image}`}
                alt={project.name}
                className="rounded-lg mb-4 w-full h-48 object-cover"
              />
              <h3 className="text-2xl font-bold mb-2">{project.name}</h3>
              <p className="text-gray-400 mb-4">{project.technologies}</p>
              <a
                href={project.link}
                className="inline-block bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-full"
                target="_blank"
                rel="noopener noreferrer"
              >
                Link
              </a>
            </div>
          ))}

          {/* "Add Project" Div */}
          <div
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-green-400 to-blue-500 p-6 rounded-lg hover:shadow-lg transform transition-transform duration-300 hover:scale-105 cursor-pointer flex justify-center items-center relative"
          >
            <img
              src="add.svg"
              alt="Add Project"
              className="w-16 h-16 opacity-50"
            />
          </div>
        </div>

        {/* Modal for Adding Project */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg w-96">
              <h3 className="text-2xl font-bold mb-4">Add New Project</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700">Project Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newProject.name}
                    onChange={handleInputChange}
                    className="text-black w-full px-4 py-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-gray-700">Technologies</label>
                  <input
                    type="text"
                    name="technologies"
                    value={newProject.technologies}
                    onChange={handleInputChange}
                    className="text-black w-full px-4 py-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-gray-700">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-black w-full px-4 py-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-gray-700">Project Link</label>
                  <input
                    type="text"
                    name="link"
                    value={newProject.link}
                    onChange={handleInputChange}
                    className="text-black w-full px-4 py-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="flex justify-between items-center mt-6">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-2 rounded-full"
                  >
                    Add Project
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-black"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
