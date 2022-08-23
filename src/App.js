import './styles/globals.scss'
import Login from './components/login/Login';
import Register from './components/register/Register';
import { BrowserRouter ,Routes, Route } from 'react-router-dom';
import Profile from './components/profile/Profile';
import Update from './components/update/Update';
import Feed from './components/feed/Feed';
import Suggestion from './components/suggestions/Suggestion';

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/Register' element={<Register/>}/>
      <Route path='/Profile' element={<Profile/>}/>
      <Route path='/Update' element={<Update />} />
      <Route path='/Feed' element={<Feed />} />
      <Route path='/Suggestion' element={<Suggestion />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;