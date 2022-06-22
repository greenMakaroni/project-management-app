import { useState } from "react"
import { FaList } from "react-icons/fa";
import { useMutation } from "@apollo/client";
import { UPDATE_PROJECT } from "../mutations/projectMutations";
import { GET_SINGLE_PROJECT } from "../queries/projectQueries";

export default function EditProjectModal({ project }) {

const [name, setName] = useState(project.name);
const [description, setDescription] = useState(project.description);
const [status, setStatus] = useState('');

const [updateProject] = useMutation(UPDATE_PROJECT, {
    variables: { id: project.id, name, description, status},
    refetchQueries: [{ query: GET_SINGLE_PROJECT, variables: {id: project.id}}],
});

const onSubmit = (e) => {
    e.preventDefault();

    updateProject(name, description, status);
}

  return (
            <>
                <button type="button" className="btn btn-warning mt-3" data-bs-toggle="modal" data-bs-target="#editProjectModal">
                    <div className="d-flex align-items-center">
                        <FaList className='icon' />
                        <div> Edit Project Details </div>
                    </div>
                </button>
        
                    <div className="modal fade" id="editProjectModal" role="dialog" aria-labelledby="editProjectModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="editProjectModalLabel"> Edit Project </h5>
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
                                        <div className="d-flex justify-content-between">
                                            <button type="submit" data-bs-dismiss="modal" className="btn btn-success"> Submit </button>
                                        </div>
                                    </form>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </>
  )
}
