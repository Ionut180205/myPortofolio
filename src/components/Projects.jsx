import React, { useState, useEffect } from 'react';

const Projects = () => {
  const [projects, setProjects] = useState([]); // State to hold fetched projects
  const [loading, setLoading] = useState(true); // State to track loading status

  // Fetch projects from the backend API
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/projects') // Replace with your API URL
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching projects:', error);
        setLoading(false);
      });
  }, []); // Empty dependency array ensures this runs once on component mount

  if (loading) {
    return (
      <div className="bg-black text-white py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Loading Projects...</h2>
      </div>
    );
  }

  return (
    <div className="bg-black text-white py-20" id="about">
      <div className="container mx-auto px-8 md:px-16 lg:px-24">
        <h2 className="text-4xl font-bold text-center mb-12">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-gray-800 p-6 rounded-lg hover:shadow-lg transform transition-transform duration-300 hover:scale-105"
            >
              <img
                src={`data:image/jpeg;base64,${project.image}`} // Display Base64 image
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
        </div>
      </div>
    </div>
  );
};

export default Projects;
