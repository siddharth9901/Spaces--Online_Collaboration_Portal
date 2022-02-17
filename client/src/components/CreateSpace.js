import React, { useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

const CreateSpace = () => {
  const mEmail = localStorage.getItem('adminUsername');
  //console.log(mEmail);
  const history = useHistory();
  const [space, setSpace] = useState({
    name: "",
    uniqueSpaceId: "",
    spaceUsersEmailId: "",
    spaceDescription: "",
    budget: "",
    adminEmailId: mEmail
  });

  let name, value;//(#28 8:20)
  const handleInupts = (e) => {
    name = e.target.name;
    value = e.target.value;
    setSpace({ ...space, [name]: value });
  }

  //SEMI COLAN SEPRATED INPUT:--->
  //   const handleCInupts = (e) => {
  //     name=e.target.name;
  //     value = e.target.value
  //     setProj({...space, [name]: value.split(";")});
  // }

  const PostData = async (e) => {
    //e.preventDefault();
    const { name, adminEmailId, spaceUsersEmailId, emailDomain, uniqueSpaceId, spaceDescription, budget } = space;//Obj destructuring
    const res = await fetch("https://spaces-server.herokuapp.com/createNewSpace", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name, adminEmailId, spaceUsersEmailId: spaceUsersEmailId.split(";"), emailDomain, uniqueSpaceId, spaceDescription, budget
      })
    });
    const data = await res.json();
    console.log(data);
    if (res.status === 422 || !data) {
      window.alert("Invalid Registration");
      console.log("Invalid Registration");
      console.log(space);
    } else if (res.status === 201) {
      //window.alert(" New Space Created!!!");
      console.log(" Registration Successful");
      localStorage.setItem('adminUsername', adminEmailId);
      localStorage.setItem('spaceID', uniqueSpaceId);
      history.push("/OverviewPage");
    }
  }

  function validateForm(e) {
    e.preventDefault();
    var error = 0;
    var a = document.forms["createNew_space"]["name"].value;
    document.getElementById('name_error').innerHTML = '';
    if (a === null || a === "") {
      // alert("Name must be filled out");
      error++;
      document.getElementById('name_error').innerHTML = 'Name must be filled out';
    }

    var e = document.forms["createNew_space"]["uniqueSpaceId"].value;
    document.getElementById('uniqueSpaceId_error').innerHTML = '';
    if (e === null || e === "") {
      // alert("Roll no must be filled out");
      error++;
      document.getElementById('uniqueSpaceId_error').innerHTML = 'Please fill the Space ID';
    }

    var f = document.forms["createNew_space"]["spaceUsersEmailId"].value;
    document.getElementById('spaceUsersEmailId_error').innerHTML = '';
    if (f === null || f === "") {
      // alert("Roll no must be filled out");
      error++;
      document.getElementById('spaceUsersEmailId_error').innerHTML = 'Please fill the members EmailID';
    } else {
      const membersArr = f.trim().split(";");
      console.log(membersArr);
      console.log(f.length);
    }


    var g = document.forms["createNew_space"]["spaceDescription"].value;
    document.getElementById('spaceDescription_error').innerHTML = '';
    if (g === null || g === "") {
      // alert("Roll no must be filled out");
      error++;
      document.getElementById('spaceDescription_error').innerHTML = 'Please fill a space Description.';
    }

    var h = document.forms["createNew_space"]["budget"].value;
    document.getElementById('budget_error').innerHTML = '';
    if (h === null || h === "") {
      // alert("Roll no must be filled out");
      error++;
      document.getElementById('budget_error').innerHTML = 'Project Budget must be filled out';
    }

    //See if an error has occured
    if (error > 0) {
      return false;
    } else {
      PostData();
      //return true;
    }
  }

  return (
    <div class="create-new-space-whole-page">
      <div class="create-new-space-container">
        <div class="create-new-space-title">Create a new space</div>
        <form action="#" name="createNew_space" >
          <div class="create-new-space-user-details">
            <div class="create-new-space-row-1">
              <div class="create-new-space-input-box">
                <span>Space name</span>
                <input type="text" name="name" id="name"
                  value={space.name}
                  onChange={handleInupts}
                  placeholder="Enter Space Name"
                />
                <p id="name_error"></p>
              </div>
            </div>

            <div class="create-new-space-row-2">
            </div>

            <div class="create-new-space-row-3">
              <div class="create-new-space-input-box">
                <span>Unique space id</span>
                <input type="text" name="uniqueSpaceId" id="uniqueSpaceId"
                  value={space.uniqueSpaceId}
                  onChange={handleInupts}
                  placeholder="Enter Space ID" />
                <p id="uniqueSpaceId_error"></p>
              </div>
            </div>

            <div class="create-new-space-row-4">

              <div class="create-new-space-input-box">
                <span><b>Add members email address</b>(separated by ';')</span>
                <input type="text" name="spaceUsersEmailId" id="spaceUsersEmailId"
                  value={space.spaceUsersEmailId}
                  onChange={handleInupts}
                  placeholder="Enter ; seprated User email-ID's"
                />
                <p id="spaceUsersEmailId_error"></p>
              </div>

            </div>

            <div class="create-new-space-row-5">

              <div class="create-new-space-input-box">
                <span>Space description</span>
                <input type="text" name="spaceDescription" id="spaceDescription"
                  value={space.spaceDescription}
                  onChange={handleInupts}
                  placeholder="Enter your space Decription"
                />
                <p id="spaceDescription_error"></p>
              </div>
            </div>


            <div class="create-new-space-row-6">
              <div class="create-new-space-input-box">
                <span>Budget(in Rs.)</span>
                <input type="text" name="budget" id="budget"
                  value={space.budget}
                  onChange={handleInupts}
                  placeholder="Enter your Budget"
                />
                <p id="budget_error"></p>
              </div>

            </div>

            <div class="create-new-space-row-7">
              <div class="create-new-space-input-box">
                <input type="submit" value="Create a new Space" class="create_space" onClick={validateForm} />
              </div>

            </div>

          </div>

        </form>
      </div>

    </div>

  )
}

export default CreateSpace