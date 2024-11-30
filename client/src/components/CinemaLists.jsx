import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from './Loading';

const CinemaLists = ({
    cinemas,
    selectedCinemaIndex,
    setSelectedCinemaIndex,
    fetchCinemas,
    auth,
    isFetchingCinemas = false
}) => {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors }
    } = useForm();

    const [isAdding, SetIsAdding] = useState(false);

    const onAddCinema = async (data) => {
        try {
            SetIsAdding(true);
            const response = await axios.post('/cinema', data, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            });
            reset();
            fetchCinemas(data.name);
            toast.success('Add cinema successful!', {
                position: 'top-center',
                autoClose: 2000,
                pauseOnHover: false
            });
        } catch (error) {
            console.error(error);
            toast.error('Error', {
                position: 'top-center',
                autoClose: 2000,
                pauseOnHover: false
            });
        } finally {
            SetIsAdding(false);
        }
    };

    const CinemaList = ({ cinemas }) => {
        const cinemasList = cinemas?.filter((cinema) =>
            cinema.name.toLowerCase().includes(watch('search')?.toLowerCase() || '')
        );

        return cinemasList.length ? (
            cinemasList.map((cinema, index) => {
                return cinemas[selectedCinemaIndex]?._id === cinema._id ? (
                    <button
                        style={{
                            background: '#c72c2c',
                            color: 'white',
                            borderRadius: '0.375rem',
                            padding: '0.5rem 1rem',
                            fontSize: '1.25rem',
                            fontWeight: '600',
                            margin: '0.5rem',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                        }}
                        onClick={() => {
                            setSelectedCinemaIndex(null);
                            sessionStorage.setItem('selectedCinemaIndex', null);
                        }}
                        key={index}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                            e.target.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                        }}
                    >
                        {cinema.name}
                    </button>
                ) : (
                    <button
                        style={{
                            background: 'white',
                            color: '#c72c2c',
                            borderRadius: '0.375rem',
                            padding: '0.5rem 1rem',
                            fontWeight: '500',
                            border: '1px solid #c72c2c',
                            margin: '0.5rem',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                        }}
                        onClick={() => {
                            setSelectedCinemaIndex(index);
                            sessionStorage.setItem('selectedCinemaIndex', index);
                        }}
                        key={index}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                            e.target.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                        }}
                    >
                        {cinema.name}
                    </button>
                );
            })
        ) : (
            <div style={{ color: '#c72c2c', fontSize: '1.2rem', fontWeight: 'bold' }}>No cinemas found</div>
        );
    };

    return (
        <div
            style={{
                background: '#ffffff',
                borderRadius: '0.375rem',
                padding: '1rem',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                maxWidth: '600px',
                margin: '1rem auto',
            }}
        >
            <form
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                }}
                onSubmit={handleSubmit(onAddCinema)}
            >
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#c72c2c', textAlign: 'center', flex: '1 1 100%' }}>Cinema Lists</h2>
                {auth.role === 'admin' && (
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
                        <input
                            placeholder="Type a cinema name"
                            style={{
                                width: '100%',
                                borderRadius: '0.375rem',
                                border: '1px solid #c72c2c',
                                padding: '0.5rem',
                                marginRight: '0.5rem',
                                color: '#333',
                            }}
                            required
                            {...register('name', { required: true })}
                        />
                        <button
                            disabled={isAdding}
                            style={{
                                background: '#c72c2c',
                                color: 'white',
                                borderRadius: '0.375rem',
                                padding: '0.5rem 1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                opacity: isAdding ? 0.5 : 1,
                                transition: 'background 0.3s',
                            }}
                        >
                            {isAdding ? 'Processing...' : 'ADD +'}
                        </button>
                    </div>
                )}
            </form>
            <div style={{ position: 'relative', marginTop: '1rem' }}>
                <div style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <MagnifyingGlassIcon className="h-5 w-5 stroke-2 text-gray-500" />
                </div>
                <input
                    type="search"
                    style={{
                        width: '100%',
                        borderRadius: '0.375rem',
                        border: '1px solid #c72c2c',
                        padding: '0.5rem 2.5rem',
                        color: '#333',
                    }}
                    placeholder="Search cinema"
                    {...register('search')}
                />
            </div>
            {isFetchingCinemas ? (
                <Loading />
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
                    <CinemaList cinemas={cinemas} />
                </div>
            )}
        </div>
    );
};

export default CinemaLists;
