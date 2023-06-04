import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return (
    <section className='h-screen bg-white dark:bg-black flex flex-col justify-center items-center '>
      <div className='flex flex-col gap-y-4 '>
        <h1 className='text-white text-2xl capitalize '>Unauthorized!</h1>

        <p>You do not have access to the requested page.</p>
        <div className='flex justify-end'>
          <Button appearance={'primary'} onClick={goBack}>
            Go Back
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Unauthorized;
