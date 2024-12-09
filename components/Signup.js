import React from 'react';
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import user from '../reducers/user';
import { login, logout } from '../reducers/user';
import { useRouter } from "next/router";

function Signup() {
    const dispatch = useDispatch();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    const router = useRouter();

    //ETATS 
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState(''); //pour singn up
    const [emailError, setEmailError] = useState(false);
    //regex email
    const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    
    
    // Crée un new user
    const handleSubmit = () => {
        if (!EMAIL_REGEX.test(email)) {
            setEmailError(true);
            window.alert('Email not valid')
            return
        }
        
        if(password === confirmpassword){ // check si le password est égal a confirm password
		fetch(`${backendUrl}/users/signup`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ user: user, email: email, username: username, password: password }),
		}).then(response => response.json())
			.then(data => {
				if(data.token) {
					dispatch(login({ username: data.username,  token: data.token }));
					setEmail('');
                    setUsername('');
					setPassword('');
                    setConfirmPassword('');
                    console.log(data)
                    router.push("/home");
				}
                
			});
            console.log("user created")
        } else {
           // if (typeof window !== 'undefined') {
                window.alert('Password not valid');
          //  }
        }
  };
    return(
     <div className=" flex flex-1">
        <div className="bg-backImg-signup bg-cover bg-center h-screen w-9/12">
        </div>

        <div className="flex flex-col justify-around items-center w-3/12 bg-backgroundColor">
            <img src="/assets/logofinal.png" alt="Description" className='' />
                <div className='flex justify-around w-full'>
                    <img src="/assets/git.png" alt="Description" className='' />
                    <img src="/assets/apple.png" alt="Description" className='' />
                    <img src="/assets/google.png" alt="Description" className='' />
                </div>
                <img src="/assets/plus.png" alt="Description" className='' />
               <div className='flex flex-col'> 
            <input type="text" placeholder='Mail' onChange={(e) => setEmail(e.target.value)} value={email}/>
            <input type="text" placeholder='Username' onChange={(e) => setUsername(e.target.value)} value={username}/>
            <input type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} value={password}/>
            <input type="password" placeholder='Confirm password' onChange={(e) => setConfirmPassword(e.target.value)} value={confirmpassword}/>
            <button className='bg-darkPurple text-white' onClick={() => handleSubmit()}>Inscription</button>
            </div>   
        </div>
     </div>
    )
}
export default Signup;