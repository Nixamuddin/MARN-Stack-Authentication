import {useState} from 'react'
import axios from 'axios'
const Register = () => {
    const[formData,setformData]=useState({
        username: "",
        email: "",
        password: ""
    })
    const [message,setmessage]=useState(  "")
    const handleform=(e) => {
const {name,value} = e.target.value
setformData({...formData,[name]:value})
    }
    const handlesubmit = async(e) => {
e.preventDefault();
try{
const response = await axios.post('/api/user/register',formData)
setmessage(response.data.message)
}
catch(err){
    console.log(err)
    setmessage(err.data.message)
}
    }
  return (
    <>
      <div>register</div>
      <p>{message}</p>
    <form action="" onSubmit={handlesubmit}>
<input type="text" placeholder='name' name='username' value={formData.username} onChange={handleform}/>
<input type="email" placeholder='email' name='email'  value={formData.email} onChange={handleform}/>
<input type="password" placeholder='password' name='password' value={formData.password} onChange={handleform}/>
    </form>
    </>
  
  )
}

export default Register