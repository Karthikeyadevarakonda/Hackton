import useFetch from "../customHooks/useFetch"

const Dashboard = () => {

  const {data,loading,error} = useFetch("http://localhost/api...")

    if (loading) return (<div>loading....</div>);
    if (error) return (<div>Sorry Something Went Wrong..</div>)

  return (
   <div>
   {/* {data.length === 0 ? (<div>NO ITEMS FOUND</div>):
        data.map((obj)=>{
            return(<div>{obj.name}</div>)
    })} */}
   </div>
  )
}

export default Dashboard
