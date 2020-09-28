import React from "react";
import loginUser from '../strapi/loginUser' 
import registerUser from '../strapi/registerUser' 
import {UserContext} from '../context/user'
import {useHistory} from 'react-router-dom'

export default function Login() {
  const history = useHistory();
  const {userLogin, alert, showAlert} = React.useContext(UserContext);

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState("defult");
  const [isMember, setIsMember] = React.useState(true);
  let isEmpty = !email || !password || !username || alert.show;

  const toggleMember = () => {
    setIsMember(prevMember => {
      let isMember = !prevMember;
      isMember? setUsername('def') : setUsername('');
      return isMember;
    })
  }

  const handleSubmit = async e => {
    showAlert({ msg: `access data, wait...`});    

    e.preventDefault();
    let response;
    if (isMember) {
      response = await loginUser({email,password});
    } else {
      response = await registerUser({email,password,username});
    }
  
    if (response) {
      const {
        jwt:token, user:{username}
      } = response.data;

      const newUser = {token,username};
      userLogin(newUser);
      showAlert({
        msg: `you are logged in : ${username}
        . shop away my friend!`
      });
      history.push("/products");
    } else {
      showAlert({ msg: `problem. try again`, type:"danger" });    
    }
  }

  return (
    <section className="form section">
      <h2 className="section-title">
        {isMember? "sign in" : "register"}
      </h2>
      <form className="login-form">

        {/*single input */}
        <div className="form-control">
          <label htmlFor="email">email</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={e=>setEmail (e.target.value)} />
        </div>
        {/*end of single input */}

        {/*single input */}
        <div className="form-control">
          <label htmlFor="password">password</label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={e=>setPassword (e.target.value)} />
        </div>
        {/*end of single input */}

        {/*single input */}
        {!isMember && (
          <div className="form-control">
            <label htmlFor="username">username</label>
            <input 
              type="text" 
              id="username" 
              value={email} 
              onChange={e=>setUsername (e.target.value)} />
          </div>
        )}
        {/*end of single input */}    

        {/*empty form text*/}
        {isEmpty && (
          <p className="form-empty">please dont leave meee empty!!</p>
        )}    

        {/*submit btn*/}
        {!isEmpty && (
          <button type="submit"
            className="btn btn-block btn-primary"
            onClick={handleSubmit}>
              submit
          </button>
        )}

        {/*register link*/}
        <p className="register-link">
          {isMember?"need to register":"already a member"}
          <button type="button" onClick={toggleMember}>
            click here
          </button>
        </p>
      </form>
    </section>
  );
}