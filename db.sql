CREATE TABLE robot_data (
    id INT PRIMARY KEY,
    project_id INT,
    robot_state VARCHAR(255),
    air_condition VARCHAR(255),
    energy_consumption INT,
    weather_state VARCHAR(255),
    robot_condition VARCHAR(255), 
    INDEX (project_id) 
);

CREATE TABLE users (
    id INT PRIMARY KEY,
    project_id INT,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    FOREIGN KEY (project_id) REFERENCES robot_data(project_id)
);
