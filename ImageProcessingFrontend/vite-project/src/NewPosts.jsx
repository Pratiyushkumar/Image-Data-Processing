import { useState } from 'react';
import axios from 'axios';

const NewPost = () => {
  const [file, setFile] = useState();
  const [caption, setCaption] = useState('');

  const submit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('image', file);
    formData.append('caption', caption);
    const result = await axios.post('api/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log(result);
    return result;
  };

  const fileSelected = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  return (
    <>
      <form
        action='/posts'
        method='POST'
        encType='multipart/form-data'
        onSubmit={submit}
      >
        <input
          type='file'
          name='image'
          accept='image/*'
          onChange={fileSelected}
        />
        <input
          type='text'
          name='caption'
          placeholder='Caption'
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <button type='submit'>Submit</button>
      </form>
    </>
  );
};

export default NewPost;
