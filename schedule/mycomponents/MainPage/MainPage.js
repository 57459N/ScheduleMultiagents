import GroupsDisplay from "../GroupsDisplay/GroupDisplay";
import GroupEditor from "../GroupEditor/GroupEditor";
import TeacherList from "../../src/components/TeacherEditor/TeacherEditor";
import './MainPage.css'

function MainPage() {
    return ( 
        <>
            <div className="forms">
                <TeacherList></TeacherList>
                <GroupEditor></GroupEditor>
                <GroupsDisplay></GroupsDisplay> 
            </div>
        </>
     );
}

export default MainPage;