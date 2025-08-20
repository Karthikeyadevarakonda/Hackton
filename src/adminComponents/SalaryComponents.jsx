import SalaryComponentCrud from '../designingComponents/SalaryComponentsCrud'

const SalaryComponents = () => {
  return (
    <div>
     <SalaryComponentCrud baseUrl="http://localhost:8081/api/salary-components" />
    </div>
  )
}

export default SalaryComponents
