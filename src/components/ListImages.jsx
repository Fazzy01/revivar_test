import React, { useEffect, useState } from 'react'
import html2canvas from 'html2canvas';

async function fetchImage() {
    try {
        const resp = await fetch('https://api.unsplash.com/photos/random/?client_id=upoFb2aBfV4VWltYWKsaUfMjz5RiEYUlj8Frx8D5DY0&count=4');
        if (!resp.ok) {
            throw resp;
        }
        return resp.json();
    } catch (error) {
        console.warn(error);
        return null;
    }
}

export default function ListImages() {
    const [data, setData] = useState(null);
    const [isClicked, setIsClicked] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [imageurl, setImageurl] = useState('');
    const [username, setUsername] = useState('');

    useEffect(() => {
        fetchImage().then((data) => {
            setData(data);
        }).catch((error) => {
            // setError(error);
        });
    }, []);

    const handleClick = (key) => {
        setIsSubmitted(false)
        setIsClicked(true)
        setImageurl(key)
        console.log(key)
    }
    const handleChange = (e) => {
        console.log(e.target.value)
        setUsername(e.target.value)
    }
    const handleSubmit = () => {
        setIsClicked(false)
        setIsSubmitted(true)
    }

    const handleDownload = async () => {
        const container = document.querySelector('.new-image'); // Select the container element
        const canvas = await html2canvas(container, { useCORS: true })
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'image-with-text.png';
        link.click();
    };


    if (!data) {
        return <div className='flex justify-center items-center'>Loading...</div>;
    }
    return (
        <>
            <div className="flex flex-col gap-10 justify-center items-center self-center mt-[5rem]">
                <div className='grid grid-cols-[2fr_2fr] md:grid-cols-[1fr_1fr_1fr_1fr] gap-x-[5rem] gap-y-[1rem] px-[1rem]  '>
                    {data && data.map((image) =>
                        <img src={image.urls.regular}
                            alt={image.alt_description}
                            className="w-[100px] h-[125px] object-cover hover:opacity-[0.6] cursor-pointer"
                            onClick={() => handleClick(image.urls.regular)}
                        />

                    )}
                </div>
                {isClicked &&
                    <div className='flex flex-col justify-center items-center self-center gap-2'>
                        <h6 className="text-[1.4rem] ">Please Enter your name</h6>
                        <input onChange={handleChange} className='border-2 border-black max-w-[300px] h-[47px] p-2 rounded-md text-[2rem]' type="text" maxLength={10} />
                        <button type='button' onClick={handleSubmit} className='border-1 border-black  bg-slate-500 rounded-[5px] py-2 px-4 hover:opacity-[0.9] cursor-pointer'>Submit</button>
                    </div>

                }
                {isSubmitted &&
                    <div className='flex flex-col justify-center items-center'>
                        <a className="relative new-image" id="my-element" >
                            <span className='w-fit absolute text-[white] font-700 top-0 left-1/2 -translate-x-1/2 text-[1rem]'>THANKYOU</span>
                            <img src={imageurl} class="w-[100px] h-[125px] object-cover" />
                            <span className='absolute bottom-2 left-1/2 -translate-x-1/2 text-[white]'>{username}</span>

                        </a>
                        <button type='button' onClick={handleDownload} className='border-1 border-black  bg-slate-500 rounded-[5px] py-2 px-4 hover:opacity-[0.9] cursor-pointer mt-[1rem]'>Download Image</button>
                    </div>

                }

            </div>
        </>
    )
}
