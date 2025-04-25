
const Footer:React.FC = () =>{
     return(
        <footer className="bg-black text-white text-center p-3 fixed bottom-0 w-full">
        <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
      </footer>
     )
};

export default Footer;