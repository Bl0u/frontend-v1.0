import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaUserGraduate, FaChalkboardTeacher, FaHandshake, FaBookOpen } from 'react-icons/fa';

const Home = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 rounded-lg shadow-xl mb-12">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-5xl font-extrabold mb-6 leading-tight">
                        Launch Your Graduation Project <br /> with Confidence
                    </h1>
                    <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
                        Find the perfect partner, connect with expert mentors, and access curated resources to build something amazing.
                    </p>
                    {!user && (
                        <div className="space-x-4">
                            <Link
                                to="/register"
                                className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition transform hover:scale-105"
                            >
                                Get Started
                            </Link>
                            <Link
                                to="/login"
                                className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-blue-600 transition"
                            >
                                Login
                            </Link>
                        </div>
                    )}
                    {user && (
                        <div className="text-xl font-semibold">
                            Welcome back, {user.name}!
                        </div>
                    )}
                </div>
            </section>

            {/* Features Grid */}
            <section className="container mx-auto px-6 mb-20">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Everything You Need to Succeed</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Feature 1 */}
                    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition text-center border-t-4 border-blue-500">
                        <div className="text-blue-500 text-4xl mb-4 flex justify-center"><FaHandshake /></div>
                        <h3 className="text-xl font-bold mb-2 text-gray-800">Partner Pool</h3>
                        <p className="text-gray-600 mb-4">Find teammates who share your vision and skills.</p>
                        <Link to="/partners" className="text-blue-600 font-semibold hover:underline">Find Partners &rarr;</Link>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition text-center border-t-4 border-purple-500">
                        <div className="text-purple-500 text-4xl mb-4 flex justify-center"><FaChalkboardTeacher /></div>
                        <h3 className="text-xl font-bold mb-2 text-gray-800">Mentor Support</h3>
                        <p className="text-gray-600 mb-4">Get guidance from experienced mentors and industry pros.</p>
                        <Link to="/mentors" className="text-purple-600 font-semibold hover:underline">Find Mentors &rarr;</Link>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition text-center border-t-4 border-green-500">
                        <div className="text-green-500 text-4xl mb-4 flex justify-center"><FaBookOpen /></div>
                        <h3 className="text-xl font-bold mb-2 text-gray-800">Resources Hub</h3>
                        <p className="text-gray-600 mb-4">Access shared files, guides, and discussions.</p>
                        <Link to="/resources" className="text-green-600 font-semibold hover:underline">Browse Resources &rarr;</Link>
                    </div>

                    {/* Feature 4 */}
                    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition text-center border-t-4 border-orange-500">
                        <div className="text-orange-500 text-4xl mb-4 flex justify-center"><FaUserGraduate /></div>
                        <h3 className="text-xl font-bold mb-2 text-gray-800">Pro-bono Mentorship</h3>
                        <p className="text-gray-600 mb-4">Submit your project for review and get dedicated help.</p>
                        <Link to={user?.role === 'student' || !user ? "/mentorship-request" : "/mentorship-requests"} className="text-orange-600 font-semibold hover:underline">
                            {user?.role === 'mentor' ? 'Review Projects' : 'Request Help'} &rarr;
                        </Link>
                    </div>

                </div>
            </section>

        </div>
    );
};

export default Home;
