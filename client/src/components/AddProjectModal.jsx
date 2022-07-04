import { useState } from 'react';
import { FaList } from 'react-icons/fa';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_PROJECT } from '../mutations/projectMutations'
import { GET_CLIENTS } from '../queries/clientQueries';
import { GET_PROJECTS } from '../queries/projectQueries';

export default function AddProjectModal() {

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [clientId, setClientId] = useState('');
    const [status, setStatus] = useState('new');

    // get clients
    const { loading, error, data } = useQuery(GET_CLIENTS);

    const [addProject] = useMutation(ADD_PROJECT, {
        variables: {name, description, status, clientId},
        update(cache, { data: { addProject }}) {
            const { projects } = cache.readQuery({ query: GET_PROJECTS });
            cache.writeQuery({
                query: GET_PROJECTS,
                data: { projects: projects.concat([addProject]) },
            });
        }

    });

    const onSubmit = (e) => {
        e.preventDefault();
        

        // add validation here
        if(name === '' || description === '' || status === '' || clientId === 'Select Client') {
            return alert('Please fill in all fields');
        }

        addProject(name, description, status, clientId);
        
        setName('');
        setDescription('');
        setStatus('new');
        setClientId('Select Client');
    }

    if(loading) return null;
    if(error) return "Something went wrong";

    return (
        <>
            {!loading && !error && (
                <>
                    <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#addProjectModal">
                        <div className="d-flex align-items-center">
                            <FaList className='icon' />
                            <div> Add Project </div>
                        </div>
                    </button>
        
                    <div className="modal fade" id="addProjectModal" role="dialog" aria-labelledby="addProjectModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="addProjectModalLabel"> New Project </h5>
                                    <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
        
                                <div className="modal-body">
                                    <form onSubmit={onSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label">Name</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="name" 
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Description</label>
                                            <textarea
                                                className="form-control" 
                                                id="description" 
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}>
                                            </textarea>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Status</label>
                                            <select 
                                                className="form-select" 
                                                name="" id="status" 
                                                value={status} 
                                                onChange={(e) => setStatus(e.target.value)}>
                                                <option value="new"> Not started </option>
                                                <option value="started"> In progress </option>
                                                <option value="completed"> Completed </option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label"> Client </label>
                                            <select 
                                                id="clientId" 
                                                className="form-select"
                                                value={clientId}
                                                onChange={(e) => setClientId(e.target.value)}>
                                                <option> Select Client </option>
                                                { data.clients.map((client) => (
                                                    <option key={client.id} value={client.id}> {client.name} </option>
                                                )) }
                                            </select>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <button className="btn btn-outline-danger" onClick={() => (setName(''), setDescription(''), setStatus(''))}> Reset </button>
                                            <button type="submit" data-bs-dismiss="modal" className="btn btn-success"> Submit </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
