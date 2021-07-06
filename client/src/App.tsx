import { FC } from 'react';
import './App.css';
import axios from 'axios';

const App: FC = () => {
  const addUser = async () => {
    const userData = {
      email: 'user1@gmail.com',
      password: 'testing123',
    };

    try {
      let response = await axios({
        url: 'http://localhost:5000/graphql',
        method: 'POST',
        data: {
          query: `
            mutation{
              addUser(userInput:{
                email: "${userData.email}"
                password: "${userData.password}"
              }){
                _id
                email
                password
              }
            }`,
        },
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      <button onClick={addUser}>Add User</button>
    </div>
  );
};

export default App;
