import Clients from '../components/Clients';
import Projects from '../components/Projects';
import AddClientModal from '../components/AddClientModal';
import AddProjectModal from '../components/AddProjectModal';

export default function Home() {
  
  return (
    <>
        <div className="d-flex justify-content-between">
            <h5> Projects </h5>
            <AddProjectModal />
        </div>
        <Projects />
        <hr />

        <div className="d-flex justify-content-between">
            <h5> Clients </h5>
            <AddClientModal />
        </div>
        <Clients />
    </>
  )
}
