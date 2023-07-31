import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";

export default function EditPost(){
    const {id} = useParams();
    const [title,setTitle] = useState('');
    const [summary,setSummary] = useState('');
    const [content,setContent] = useState('');
    const [files,setFiles] = useState('');
    const[cover,setCover] = useState('');
    const [redirect,setRedirect] = useState(false);

    useEffect(() => {
        fetch('http://localhost:4000/post/'+id).then(response => {
            response.json().then(postInfo => {
                setTitle(postInfo.title);
                setContent(postInfo.content);
                setSummary(postInfo.summary);
            })
        })
    },[]);

    async function updatepost(ev){
        const data = new FormData();
        data.set('title',title);
        data.set('summary',summary);
        data.set('content',content);
        data.set('id',id);
        if(files?.[0]){
        data.set('file',files?.[0]);
    }
        ev.preventDefault();
        const response = await fetch('http://localhost:4000/post',{
            method: 'PUT',
            body: data,
            credentials: 'include',
        })
        if(response.ok){
        setRedirect(true);
    }
    
    }
    if(redirect){
        return <Navigate to={'/post/'+id} />
    }

    const modules = {
        toolbar: [
          [{ header: '1' }, { header: '2' }, { font: [] }],
          [{ size: [] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [
            { list: 'ordered' },
            { list: 'bullet' },
            { indent: '-1' },
            { indent: '+1' },
          ],
          ['link', 'image', 'video'],
          ['clean'],
        ],
        clipboard: {
          
          matchVisual: false,
        },
      }
    return (
        <form onSubmit={updatepost}>
            <input type="title" placeholder={'Title'} value={title} onChange={ev => setTitle(ev.target.value)}></input>
            <input type="summary" placeholder={'Summary'} value={summary} onChange ={ev => setSummary(ev.target.value)}/>
            <input type="file" onChange={ev => setFiles(ev.target.files)}/>
            <ReactQuill modules={modules} value={content} onChange={newValue => setContent(newValue)}/>
            <button style={{marginTop:'5px'}}>Edit Post</button>
        </form>
    )
}