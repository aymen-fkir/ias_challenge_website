CREATE TABLE robot_data (
    id INT PRIMARY KEY,
    project_id INT,
    robot_id INT,
    robot_state VARCHAR(255),
    energy_consumption INT,
    robot_condition VARCHAR(255) 
);

CREATE TABLE users (
    id INT PRIMARY KEY,
    project_id INT,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL, 
    FOREIGN KEY (project_id) REFERENCES robot_data(project_id)
);
CREATE TABLE weather_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    weather_condition VARCHAR(255) NOT NULL,
    air_condition VARCHAR(255) NOT NULL,
    project_id INT,
    FOREIGN KEY (project_id) REFERENCES users(project_id)
);