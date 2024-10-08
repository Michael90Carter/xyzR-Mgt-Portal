import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
 import {Navbar, Footer, Sidebar, ThemeSettings,Signin} from './components';
 import {Dashboard, Employee, Department } from './pages';
 import { useStateContext } from './contexts/ContextProvider';
 import './App.css';

const App = () => {
    const { activeMenu, themeSettings, setThemeSettings, setCurrentColor,setCurrentMode, currentMode, currentColor} = useStateContext();
    useEffect(() => {
        const currentThemeColor = localStorage.getItem('colorMode');
        const currentThemeMode = localStorage.getItem('themeMode');
        if (currentThemeColor && currentThemeMode) {
          setCurrentColor(currentThemeColor);
          setCurrentMode(currentThemeMode);
        }
      }, []);
    return (       

        
    <div className={currentMode ==='Dark' ? 'dark' : ''}>         
            <BrowserRouter basename="/xyz-R">

            

                <div className='flex relative dark:bg-main-dark.bg'>   
                    <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
                        <TooltipComponent content="Settings" position='Top'>
                            <button type="button"

                            className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
                            onClick={() => setThemeSettings(true)}
                            style={{background: currentColor,
                            borderRadius:'50%'}}>
                                
                                <FiSettings />
                            </button>
                        </TooltipComponent>
                    </div>

                    


                    {activeMenu ?(
                        <div className='w-72 fixed sidebar
                        dark:bg-secondary-dark-bg
                        bg-white'>
                            <Sidebar />
                        </div>
                    ) : (
                        <div className='w-0
                        dark:bg-secondary-dark-bg'> 
                            <Sidebar />
                        </div>
                    )}
                    <div
                        className={
                            activeMenu
                            ? 'dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  '
                            : 'bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 '
                        }
                    >
                        <div className='fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full '> 
                            <Navbar />
                        </div>
                            <div>
                                {themeSettings && (<ThemeSettings />)}
                                    <Routes>

                                            {/* Authentication */}
                                            <Route path='/' element={(<Signin />)} />
                                        {/* <Route path='/' element={(<Dashboard />)} /> */}
                                        <Route path='/dashboard' element={(<Dashboard />)} />

                                        {/* other pages */}
                                        <Route path='/employees' element={<Employee />} />

                                        <Route path='/departments' element={<Department />} />
                                        

                                    </Routes>
                                </div>
                                <Footer />
                            </div>
                </div>
            </BrowserRouter>
        
        </div>
    )
}


export default App;