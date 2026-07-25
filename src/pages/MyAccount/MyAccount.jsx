import { Link } from 'react-router-dom'
import MyAccountList from '../../components/MyAccountList/MyAccountList'
import { PATHS } from '../../routes/paths'

/** Private dashboard shown only to authenticated users (see the route guard). */
function MyAccount() {
  return (
    <section className="flex flex-col items-center">
      <MyAccountList onSave={() => {}} />
      <Link
        to={PATHS.changePassword}
        className="mt-4 text-sm font-medium text-brand hover:underline"
      >
        Change password
      </Link>
    </section>
  )
}

export default MyAccount
