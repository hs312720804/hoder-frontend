export default function login(data) {
  return this.fetch({
    method: 'post',
    url: '/api/login',
    data 
  }).then((user) => {
    this.state = user
    return user
  }).catch(()=>{
     this.state={
       username:"wanghaihua@coocaa.com",
       password:"123456"
     }
     return {
        username:"wanghaihua@coocaa.com",
        password:"123456"
     }
  })
}