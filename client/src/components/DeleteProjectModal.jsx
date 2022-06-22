import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { DELETE_PROJECT } from '../mutations/projectMutations';
import { GET_PROJECTS } from '../queries/projectQueries';
import { FaTrash } from 'react-icons/fa';

export default function DeleteProjectModal({ projectId, projectName }) {
    const navigate = useNavigate();

    const [deleteProject] = useMutation(DELETE_PROJECT, {
        variables: { id: projectId },
        onCompleted: () => navigate('/'),
        refetchQueries: [{ query: GET_PROJECTS}],
    });

  return (

    <>
      <button type="button" className="btn btn-danger mt-3" data-bs-toggle="modal" data-bs-target="#deleteProjectModal">
        <FaTrash className="icon"/> Delete Project
      </button>

      <div className="modal fade" id="deleteProjectModal" role="dialog" aria-labelledby="deleteProjectModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title" id="deleteProjectModalLabel"> Are you sure? </h1>
              <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p> Are you sure you want to delete project <b>"{projectName}"</b>? </p>
              <p> this change cannot be undone </p>
            </div>
            <div className="modal-footer d-flex justify-content-between">
              <button type="button" className="btn btn-dark" data-bs-dismiss="modal">Cancel</button>
              <button className="btn btn-danger" data-bs-dismiss="modal" onClick={deleteProject}> 
                 Delete Project 
             </button>
            </div>
          </div>
        </div>
      </div>
    </>

  )
}
