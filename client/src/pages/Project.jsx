import { Link, useParams } from 'react-router-dom'
import Spinner from '../components/Spinner'
import ClientInfo from '../components/ClientInfo'
import DeleteProjectModal from "../components/DeleteProjectModal"
import EditProjectModal from "../components/EditProjectModal"
import { useQuery } from '@apollo/client'
import { GET_SINGLE_PROJECT } from '../queries/projectQueries'
import { FaTrash } from 'react-icons/fa'


export default function Project() {
    const { id } = useParams();
    const { loading, error, data } = useQuery(GET_SINGLE_PROJECT, {
        variables: { id }
    });

    if(loading) return <Spinner />
    if(error) return <p> Something went wrong </p>

  return (
    <>
        { !loading && !error && (
            <div className="mx-auto w-75 card p-5">
                <Link to='/' className="btn btn-outline-danger btn-sm w-25 d-inline ms-auto"> Go Back </Link>
                <h1> { data.project.name } </h1>
                <p> { data.project.description } </p>

                <h5 className="mt-3"> Project Status </h5>
                <p className="lead"> { data.project.status } </p>

                <ClientInfo client={ data.project.client } />
                
                <div className="modal-footer d-flex justify-content-between">
                    <EditProjectModal project={data.project} />
                    <DeleteProjectModal projectId={ id } projectName={ data.project.name } />
                </div>
            </div>
        )}
    </>
  )
}
