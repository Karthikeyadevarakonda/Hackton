import { useEffect, useState } from "react";
import axios from 'axios'

export default function useFetch(url){

    const [data,setData] = useState([]);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(null);

       async function fetchData() {
             try{
                 setLoading(true)
                 const res = await axios.get(url)
                 setData(res.data)
             }catch(err){
                 console.error(`ERROR IN FETCHING THE URL ${url}`)
                 setError(err)
             }finally{
                 setLoading(false)
             }
       }

       useEffect(()=>{fetchData()},[url])

       return {data,loading,error}
}

