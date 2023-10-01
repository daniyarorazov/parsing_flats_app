import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Pagination } from '@nextui-org/react';
import { useLocation, useNavigate } from 'react-router-dom';
interface Flat {
    id: number;
    title: string;
    imageurl: string;
    price: number;
}


function FlatList() {
    const [flats, setFlats] = useState<Flat[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const page = parseInt(queryParams.get('page') || '1');
    const flatsPerPage = 20;


    useEffect(() => {
        setIsLoading(true);

        axios.get<Flat[]>(`http://127.0.0.1:3001/api/flats`)
            .then(response => {
                const startIndex = flatsPerPage * (page - 1);
                const endIndex = startIndex + flatsPerPage;

                setFlats(response.data.slice(startIndex, endIndex));
                setTotalPages(response.data.length / flatsPerPage);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data', error);
                setIsLoading(false);
            });

        navigate(`?page=${page}`);
    }, [page, navigate]);

    const nextPage = () => {
        if (page < totalPages) {
            navigate(`?page=${page + 1}`);
        }
    };

    const prevPage = () => {
        if (page > 1) {
            navigate(`?page=${page - 1}`);
        }
    };

    const choosePage = (chosenPage: number) => {
        navigate(`?page=${chosenPage}`);
    }


    return (
        <div>
            <h1 className='bg-green-300 mb-20'>List of Flats</h1>

            {isLoading ? (
                <p>Loading...</p>
            ) : (flats.length === 0) ? (
                    <p>I am sorry, but page does not exist.</p>
                ) : (
                <div>
                    <div className="grid-flats">
                        <ul className="flat-block">
                            {flats.map((flat, key) => (
                                <li key={key}>
                                    <img src={flat.imageurl} alt={flat.title} />
                                    <p className="text-left text-xl font-semibold mt-2">{flat.title}</p>
                                    <span className="text-left">{flat.price}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="pagination">
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="flat"
                                color="secondary"
                                onClick={prevPage}
                            >
                                Previous
                            </Button>
                        </div>
                        <Pagination
                            total={totalPages}
                            color="secondary"
                            page={page}
                            onChange={choosePage}
                        />
                        <div className="flex gap-2">

                            <Button
                                size="sm"
                                variant="flat"
                                color="secondary"
                                onClick={nextPage}>
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FlatList;
