const { request } = require('express');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


require('../db/conn');
const User = require("../models/userSchema");

//Space creation
const Space = require("../models/spaceSchema");


//CONVERSATION:
const Conversation = require("../models/conversation");
//MESSAGE:
const Message = require("../models/message");


router.get('/', (req, res) => {
    res.send('Hello from the other side');
});




// VERIFYING TOKEN:--->

function VerifyToken(token) {
    try {
        var decoded = jwt.verify(token, "Testing12345")
        console.log(decoded)
        return decoded
    }
    catch (err) {
        console.log("Error!!!", err);
    }
}


//USING ASYNC-AWAIT
//When user regiaters:--->
router.post('/register', async (req, res) => {

    const { name, email, phone, password, cpassword, skills } = req.body; //object destructuring

    if (!name || !email || !phone || !password || !cpassword || !skills) {
        return res.status(422).json({ error: "Please fill all fields" });
    }
    try {
        const userExist = await User.findOne({ email: email });

        if (userExist) {
            return res.status(422).json({ error: "Email already exists" });
        } else if (password != cpassword) {
            return res.status(422).json({ error: "Passwords don't match" });
        } else {
            const user = new User({ name, email, phone, password, cpassword, skills });
            await user.save();
            res.status(201).json({ message: "user registered successfully" });
        }
    } catch (err) {
        console.log(err);
    }
});

//LOGIN Route:--->


router.post('/signin', async (req, res) => {
    try {
        //let token;
        const { email, password, uniqueSpaceId } = req.body;
        if (!email || !password || !uniqueSpaceId) {
            //console.log(req.body);
            return res.status(400).json({ error: "Please fill the data" })
        }
        const userLogin = await User.findOne({ email: email });
        const spaceLogin = await Space.findOne({ uniqueSpaceId: uniqueSpaceId })
        const spaceName = spaceLogin?.name;
        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);
            if (!isMatch) {
                res.status(400).json({ error: "Invalid Password" });
            } else if (!spaceLogin) {
                res.status(400).json({ error: "SpaceID Not found" });
            } else {
                if (spaceLogin.adminEmailId === email) {
                    uniqueSpaceIdVar = uniqueSpaceId;
                    console.log(uniqueSpaceIdVar);
                    console.log(spaceLogin._id);
                    var token = jwt.sign({ username: email, spaceID: uniqueSpaceId, spaceName: spaceName, admin: true }, "Testing12345", { expiresIn: '5h' })
                    res.status(202).send({ token });
                }
                else if (spaceLogin.spaceUsersEmailId.includes(email)) {
                    uniqueSpaceIdVar = uniqueSpaceId;
                    var token = jwt.sign({ username: email, spaceID: uniqueSpaceId, spaceName: spaceName, admin: false }, "Testing12345", { expiresIn: '5h' })
                    res.status(200).send({ token });
                }
                else {
                    res.status(400).json({ error: "Invalid Credentials" });
                }
            }
        } else {
            res.status(400).json({ error: "Invalid Email Id" });
        }
    } catch (err) {
        console.log(err);
    }
});



//OverView Page --->

router.get('/overview/:token', async (req, res) => {
    try {
        if (!req.params.token) {
            console.log("Overview API ERROR!!")
        } else {
            const decodedToken = VerifyToken(req.params.token);
            const uniqueSpaceId = decodedToken.spaceID;

            Space.findOne({ uniqueSpaceId: uniqueSpaceId }).then(Data => {
                res.status(200).send(Data);
            })
        }
    } catch (err) {
        console.log(err);
    }
});



//Create Space Login Route:--->
router.post('/createNewSpaceSignin', async (req, res) => {
    try {
        //let token;
        const { email, password, } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Please fill the data" })
        }

        const userLogin = await User.findOne({ email: email });

        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);
            if (!isMatch) {
                console.log("isMatch")
                res.status(400).json({ error: "Invalid Password" });
            } else {
                res.json({ error: "Login Successfully" });
            }
        } else {
            res.status(400).json({ error: "Invalid Email Id" });
            console.log("Email")
        }
    } catch (err) {
        console.log(err);
    }
});


//Craete NEW PROJECT:--->
router.post('/createNewSpace', async (req, res) => {
    const { name, adminEmailId, spaceUsersEmailId, uniqueSpaceId, spaceDescription, budget } = req.body; //object destructuring

    if (name == null || !adminEmailId || !spaceUsersEmailId || !uniqueSpaceId || !spaceDescription || !budget) {
        console.log(req.body)
        return res.status(422).json({ error: req.body });
    }
    try {
        const spaceExist = await Space.findOne({ uniqueSpaceId: uniqueSpaceId });
        if (spaceExist) {
            return res.status(422).json({ error: "SpaceId already taken" });
        } else {
            const space = new Space({ name, adminEmailId, spaceUsersEmailId, uniqueSpaceId, spaceDescription, budget });
            await space.save();
            res.status(201).json({ message: "Space Created successfully" });
            console.log("Space Created", space)
        }
    } catch (err) {
        console.log(err);
    }
});

//ADD MEMEBER:---->
//ADD ALERT SAME MEMBER CAN NOT BE ADDED TWICE
router.post('/addMember', async (req, res) => {
    //console.log(req.body);
    const { memberEmailID, token } = req.body; //object destructuring
    const decodedToken = VerifyToken(token);
    const spaceID = decodedToken.spaceID;
    if (!memberEmailID || !spaceID) {
        console.log(memberEmailID);
        return res.status(422).json({ error: "Provide all data" });
    }
    try {
        const memberExist = await User.findOne({ email: memberEmailID });
        const space = await Space.findOne({ uniqueSpaceId: spaceID });
        if (memberExist) {
            //console.log(memberExist)
            if (space.spaceUsersEmailId.includes(memberEmailID)) {
                return res.status(422).json({ error: "Member already added" })
            } else {
                space.spaceUsersEmailId.push(memberEmailID);
                await space.save();
                return res.status(201).json({ message: "Member added Successfully!" });
            }
        } else {
            console.log(req.body);
            res.status(422).json({ error: "An Error Occured Please try again" });
        }
    } catch (err) {
        console.log(err);
    }
});

//REMOVE MEMBER-->
router.post('/removeMember', async (req, res) => {
    //console.log(req.body);
    const { memberEmailID, token } = req.body; //object destructuring
    console.log(req.body)
    const decodedToken = VerifyToken(token);
    const spaceID = decodedToken.spaceID;
    if (!memberEmailID || !spaceID) {
        //console.log(memberEmailID);
        return res.status(422).json({ error: "Provide all data" });
    }
    try {
        const memberExist = await User.findOne({ email: memberEmailID });
        const space = await Space.findOne({ uniqueSpaceId: spaceID });
        if (space.spaceUsersEmailId.includes(memberEmailID)) {
            const memberIndex = space.spaceUsersEmailId.indexOf(memberEmailID);
            space.spaceUsersEmailId.splice(memberIndex, 1);
            await space.save();
            return res.status(201).json({ message: "Member removed Successfully!" });
        } else {
            res.status(422).json({ error: "Member not a part of Space!" });
        }
    } catch (err) {
        console.log(err);
    }
});

//VIEW MEMBER DETAILS:--> 
router.get('/viewMembers/:token', async (req, res) => {
    try {
        const decodedToken = VerifyToken(req.params.token);
        const uniqueSpaceId = decodedToken.spaceID;
        const UserEmail = decodedToken.username;
        if (!uniqueSpaceId) {
            return res.status(400).json({ error: "An error occured while sending request" })
        } else {
            listOfUsers = [];
            const space = await Space.findOne({ uniqueSpaceId: uniqueSpaceId })
            numOfUsers = space.spaceUsersEmailId.length
            for (var i = 0; i < numOfUsers; i++) {
                const user = await User.findOne({ email: space.spaceUsersEmailId[i] });
                if (user != null) {
                    listOfUsers.push(user);
                }
            }

            res.status(200).send(listOfUsers);
        }
    } catch (err) {
        console.log(err);
    }
});

//VIEW MANAGER DETAILS:--->
router.get('/viewAdmin/:token', async (req, res) => {
    try {
        const decodedToken = VerifyToken(req.params.token);
        const uniqueSpaceId = decodedToken.spaceID;
        if (!uniqueSpaceId) {
            return res.status(400).json({ error: "An error occured while sending request" })
        } else {
            const space = await Space.findOne({ uniqueSpaceId: uniqueSpaceId })
            const adminEmailID = space.adminEmailId;
            const admin = await User.findOne({ email: adminEmailID });
            console.log(admin);
            res.status(200).send(admin);
        }
    } catch (err) {
        console.log(err);
    }
});

// ADD TASK:--->
router.post('/addTask', async (req, res) => {
    console.log(req.body);
    const { memberEmailIDs, token, taskName, time, status, startDate, endDate } = req.body; //object destructuring
    const decodedToken = VerifyToken(token);
    const spaceID = decodedToken.spaceID;
    if (!memberEmailIDs || !token || !spaceID || !taskName || !time || !status || !startDate || !endDate) {
        console.log(memberEmailIDs);
        return res.status(422).json({ error: "Provide all data" });
    }
    try {
        const memberEmailArr = memberEmailIDs.split(";");
        const space = await Space.findOne({ uniqueSpaceId: spaceID });
        const spaceDoc_ID = space._id
        for (var i = 0; i < memberEmailArr.length; i++) {
            //const memberExist = space.spaceUsersEmailId.includes(memberEmailArr[i]);
            if (!space.spaceUsersEmailId.includes(memberEmailArr[i]) && space.adminEmailId !== memberEmailArr[i]) {
                return res.status(422).json({ error: "Member Not Found" });
            }
        }
        space.tasks.push({ name: taskName, status: status, assignedTo: memberEmailArr, spaceDoc_ID: spaceDoc_ID, startDate: startDate, endDate: endDate, time: time })
        console.log(space);
        await space.save()
        return res.status(201).json({ message: "Task added Successfully!" });
    } catch (err) {
        console.log(err);
    }
});

//SHOW MEMBER TASKS:--->
router.get('/viewMemberTasks/:token', async (req, res) => {
    try {
        const decodedToken = VerifyToken(req.params.token);
        const uniqueSpaceId = decodedToken.spaceID;
        const UserEmail = decodedToken.email;
        if (!uniqueSpaceId) {
            return res.status(400).json({ error: "An error occured while sending request" })
        } else {
            var listOfTasks = [];
            const space = await Space.findOne({ uniqueSpaceId: uniqueSpaceId })
            const allTasks = space.tasks
            for (var i = 0; i < allTasks.length; i++) {
                if (allTasks[i].assignedTo.includes(UserEmail)) {
                    listOfTasks.push(allTasks[i]);
                }
            }
            res.status(200).send(listOfTasks);
        }
        // const spaceOverview = await Space.findOne({ uniqueSpaceId: uniqueSpaceId});    
    } catch (err) {
        console.log(err);
    }
});

//SHOW MANAGER TASKS:---->
router.get('/viewSpaceTasks/:token', async (req, res) => {
    try {
        const decodedToken = VerifyToken(req.params.token);
        const uniqueSpaceId = decodedToken.spaceID;
        const Email = decodedToken.username; //PASS MANAGER EMAIL ID IN PARAMETERS
        if (decodedToken.admin) {
            if (!Email || !uniqueSpaceId) {
                return res.status(400).json({ error: "An error occured while sending request" })
            } else {
                const space = await Space.findOne({ uniqueSpaceId: uniqueSpaceId })
                const allTasks = space.tasks
                res.status(200).send(allTasks);
            }
        } else {
            var listOfTasks = [];
            const space = await Space.findOne({ uniqueSpaceId: uniqueSpaceId })
            const allTasks = space.tasks
            for (var i = 0; i < allTasks.length; i++) {
                if (allTasks[i].assignedTo.includes(Email)) {
                    listOfTasks.push(allTasks[i]);
                }
            }
            res.status(200).send(listOfTasks);
        }
    }
    catch (err) {
        console.log(err);
    }
});


//REMOVE TASK-->
router.post('/removeTask', async (req, res) => {
    const { taskDocID, token } = req.body; //object destructuring
    const decodedToken = VerifyToken(token);
    const spaceID = decodedToken.spaceID;
    if (decodedToken.admin) {
        const adminEmailID = decodedToken.username;
        if (!adminEmailID || !spaceID || !taskDocID) {
            return res.status(422).json({ error: "Provide all data" });
        }
        try {

            const space = await Space.findOne({ uniqueSpaceId: spaceID });
            // const taskID = String(taskDocI
            space.tasks.pull(String(taskDocID));
            await space.save();
            return res.status(201).json({ message: "Task removed Successfully!" });
        } catch (err) {
            console.log(err);
        }
    }
});

//UPDATE TASK ---->
router.post('/updateTask', async (req, res) => {
    //console.log(req.body);
    const { memberEmailIDs, token, taskName, time, status, startDate, endDate, taskDocID } = req.body; //object destructuring
    const decodedToken = VerifyToken(token);
    const spaceID = decodedToken.spaceID;

    if (!memberEmailIDs || !spaceID || !taskName || !time || !status || !startDate || !endDate || !taskDocID) {
        console.log(memberEmailIDs);
        return res.status(422).json({ error: "Provide all data" });
    }
    try {
        const memberEmailArr = memberEmailIDs.split(";");
        const space = await Space.findOne({ uniqueSpaceId: spaceID });
        const spaceDoc_ID = space._id
        //const taskID = String(taskDocID);
        space.tasks.pull(String(taskDocID));
        await space.save();
        // space.tasks.push({name: taskName},)
        // await space.save();
        // for (var i = 0; i < memberEmailArr.length; i++) {
        //     const memberExist = space.spaceUsersEmailId.includes(memberEmailArr[i]);
        //     if (!memberExist) {
        //         return res.status(422).json({ error: "Member Not Found" });
        //     }
        // }
        for (var i = 0; i < memberEmailArr.length; i++) {
            //const memberExist = space.spaceUsersEmailId.includes(memberEmailArr[i]);
            if (!space.spaceUsersEmailId.includes(memberEmailArr[i]) && space.adminEmailId !== memberEmailArr[i]) {
                return res.status(422).json({ error: "Member Not Found" });
            }
        }
        space.tasks.push({ name: taskName, status: status, assignedTo: memberEmailArr, spaceDoc_ID: spaceDoc_ID, startDate: startDate, endDate: endDate, time: time })
        await space.save()
        return res.status(201).json({ message: "Task updated Successfully!" });
    } catch (err) {
        console.log(err);
    }
});

//SHOW GOALS----->
router.get('/viewSpaceGoals/:token', async (req, res) => {
    try {
        const decodedToken = VerifyToken(req.params.token)
        console.log(decodedToken);
        const uniqueSpaceId = decodedToken.spaceID;
        if (!uniqueSpaceId) {
            return res.status(400).json({ error: "An error occured while sending request" })
        } else {
            const space = await Space.findOne({ uniqueSpaceId: uniqueSpaceId })
            const allGoals = space.goals
            res.status(200).send(allGoals);
        }
    }
    catch (err) {
        console.log(err);
    }
});

//ADD GOAL:---->
router.post('/addGoal', async (req, res) => {
    //console.log(req.body);
    const { token, name, type, status, expectedCompletionDate, description } = req.body; //object destructuring
    const decodedToken = VerifyToken(token);
    const spaceID = decodedToken.spaceID;
    if (!spaceID || !name || !type || !status || !expectedCompletionDate || !description) {
        //console.log(memberEmailIDs);
        return res.status(422).json({ error: "Provide all data" });
    }
    try {
        const space = await Space.findOne({ uniqueSpaceId: spaceID });
        const spaceDoc_ID = space._id

        space.goals.push({ name: name, status: status, type: type, expectedCompletionDate: expectedCompletionDate, description: description })
        await space.save()
        console.log(req.body);
        return res.status(201).json({ message: "Goal added Successfully!" });
    } catch (err) {
        console.log(req.body);
        console.log(err);
    }
});

//UPDATE GOAL STATUS:----->
router.post('/updateGoal', async (req, res) => {
    //console.log(req.body);
    const { goalDocID, token } = req.body; //object destructuring
    const decodedToken = VerifyToken(token);
    const spaceID = decodedToken.spaceID;
    if (!goalDocID || !spaceID) {
        return res.status(422).json({ error: "Provide all data" });
    }
    try {
        await Space.findOneAndUpdate({ uniqueSpaceId: spaceID, "goals._id": goalDocID }, { "goals.$.status": "Completed", "goals.$.expectedCompletionDate": new Date() });
        return res.status(201).json({ message: "Goal added Successfully!" });
    } catch (err) {
        console.log(req.body);
        console.log(err);
    }
});

//REMOVE GOAL:------->
router.post('/removeGoal', async (req, res) => {
    const { token, goalDocID } = req.body; //object destructuring
    const decodedToken = VerifyToken(token);
    const spaceID = decodedToken.spaceID;
    if (decodedToken.admin) {
        const adminEmailID = decodedToken.username;
        if (!adminEmailID || !spaceID || !goalDocID) {
            return res.status(422).json({ error: "Provide all data" });
        }
        try {
            const space = await Space.findOne({ uniqueSpaceId: spaceID });
            // const taskID = String(taskDocI
            space.goals.pull(String(goalDocID));
            await space.save();
            return res.status(201).json({ message: "Goal removed Successfully!" });
        } catch (err) {
            console.log(err);
        }
    }
});


//SHOW CALENDAR EVENTS:---->
router.get('/viewSpaceEvents/:token', async (req, res) => {
    if (!req.params.token) {
        console.log("Calendar API ERROR!!")
    } else {
        try {
            const decodedToken = VerifyToken(req.params.token);
            const uniqueSpaceId = decodedToken.spaceID;
            const Email = decodedToken.username; //PASS EMAIL ID IN PARAMETERS
            var event = { title: "", date: Date, start: Date, end: Date };
            var events = [event];
            if (!Email || !uniqueSpaceId) {
                return res.status(400).json({ error: "An error occured while sending request" })
            } else {
                const space = await Space.findOne({ uniqueSpaceId: uniqueSpaceId })
                if (space.spaceUsersEmailId.includes(Email)) {
                    //USER IS A Member
                    const allTasks = space.tasks;
                    for (var i = 0; i < allTasks.length; i++) {

                        if (allTasks[i].assignedTo.includes(Email)) {
                            tempEndDate = new Date(allTasks[i].endDate).toISOString().split('T')[0];
                            tempStartDate = new Date(allTasks[i].startDate).toISOString().split('T')[0];
                            //events.push({ title: "Task: " + allTasks[i].name, start: tempStartDate, end: tempEndDate })
                            events.push({ title: "Start " + allTasks[i].name, date: tempStartDate })
                            events.push({ title: "Complete " + allTasks[i].name, date: tempEndDate })
                        }
                    }
                    const allGoals = space.goals
                    for (var i = 0; i < allGoals.length; i++) {
                        tempEndDate = new Date(allGoals[i].expectedCompletionDate).toISOString().split('T')[0];
                        if (allGoals[i].type == "Deliverable") {
                            events.push({ title: "Deliverable: " + allGoals[i].name, date: tempEndDate });
                        } else {
                            events.push({ title: "Goal: " + allGoals[i].name, date: tempEndDate });
                        }
                    }
                    res.status(200).send(events);
                } else {
                    //USER IS Admin
                    const allTasks = space.tasks;
                    for (var i = 0; i < allTasks.length; i++) {
                        tempEndDate = new Date(allTasks[i].endDate).toISOString().split('T')[0];
                        tempStartDate = new Date(allTasks[i].startDate).toISOString().split('T')[0];
                        events.push({ title: "Start " + allTasks[i].name, date: tempStartDate })
                        events.push({ title: "Complete " + allTasks[i].name, date: tempEndDate })
                    }
                    const allGoals = space.goals
                    for (var i = 0; i < allGoals.length; i++) {
                        tempEndDate = new Date(allGoals[i].expectedCompletionDate).toISOString().split('T')[0];
                        if (allGoals[i].type == "Goal") {
                            events.push({ title: "Goal: " + allGoals[i].name, date: tempEndDate });
                        }
                    }
                    res.status(200).send(events);
                }

            }
        }
        catch (err) {
            console.log(err);
        }
    }
});

//SHOW PROFILE DETAILS:---->
router.get('/profileInfo/:token', async (req, res) => {
    try {
        const decodedToken = VerifyToken(req.params.token);
        const UserEmail = decodedToken.username;
        if (!UserEmail) {
            return res.status(400).json({ error: "An Error occured while sending request!" })
        } else {
            User.findOne({ email: UserEmail }).then(Data => {
                res.status(200).send(Data);
            })
        }
    } catch (err) {
        console.log(err);
    }
});

//UPDATE USER PROFILE INFO:--->
router.post('/updateProfile', async (req, res) => {
    console.log(req.body);
    const { token, name, phone, password, cpassword, skills } = req.body; //object destructuring
    const decodedToken = VerifyToken(token);
    const UserEmail = decodedToken.username;
    if (!UserEmail, !name, !phone, !skills) {
        console.log("Invalid Request Profile Update");
        return res.status(422).json({ error: "An Error Occured while sending data!" });
    }
    try {

        if (password.trim().length > 0 && cpassword.trim() == password.trim()) {
            if (password != cpassword) {
                return res.status(422).json({ error: "Passwords don't match" });
            } else {
                newpassword = await bcrypt.hash(password, 12);
                newcpassword = await bcrypt.hash(cpassword, 12);
                await User.findOneAndUpdate({ email: UserEmail }, { email: UpdatedEmail, name: name, phone: phone, skills: skills, password: newpassword, cpassword: newcpassword });
                return res.status(201).json({ message: "Info along with password updated Successfully!" });
            }
        } else { //IF PASSWORD IS NOT UPDATED:---->
            await User.findOneAndUpdate({ email: UserEmail }, { name: name, phone: phone, skills: skills });
            return res.status(201).json({ message: "Info updated Successfully!" });
        }

    } catch (err) {
        console.log(err);
    }
});

//-----------------------------------CONVERSATIONS--------------------------------------
//NEW CONVERSATION:---->
router.post("/newConversation", async (req, res) => {
    const newConversation = new Conversation({
        members: [req.body.senderEmail, req.body.receiverEmail],
        spaceID: req.body.spaceID
    });
    try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET CONVERATIONS OF A USER:--->
//THE GET METHOD RETURNS ALL THE CONVERSATIONS INCLUDING THE USER-EMAIL 
router.get("/getMyConversation/:token", async (req, res) => {
    const decodedToken = VerifyToken(req.params.token);
    const uniqueSpaceId = decodedToken.spaceID;
    const Email = decodedToken.username;
    try {
        const conversation = await Conversation.find({
            spaceID: uniqueSpaceId,
            members: { $in: [Email] }
        });
        res.status(200).json(conversation);
    } catch (err) {
        res.status(500).json(err);
    }
});

//--------------------------------MESSAGES----------------------------------------------

//ADD
router.post("/sendMessage", async (req, res) => {
    const newMessage = new Message(req.body);
    const lastMessageConv = newMessage.text;
    const lastMessageSndr = newMessage.sender;
    await Conversation.findByIdAndUpdate(newMessage.conversationId, { lastMessage: lastMessageConv, lastMessageSender: lastMessageSndr });
    try {
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET ALL MESSAGES INSIDE A CONVERSATION
router.get("/getMessages/:conversationId", async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId,
        });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});



//VIEW MEMBER Contacts:--> 
router.get('/viewContacts/:token', async (req, res) => {
    try {
        const decodedToken = VerifyToken(req.params.token);
        const uniqueSpaceId = decodedToken.spaceID;
        const UserEmail = decodedToken.username;
        if (!uniqueSpaceId) {
            return res.status(400).json({ error: "An error occured while sending request" })
        } else {
            var listContacts = [];
            const space = await Space.findOne({ uniqueSpaceId: uniqueSpaceId })
            numOfUsers = space.spaceUsersEmailId.length
            if (space.adminEmailId != UserEmail) {
                const admin = await User.findOne({ email: space.adminEmailId });
                listContacts.push(admin);
            }
            for (var i = 0; i < numOfUsers; i++) {
                const user = await User.findOne({ email: space.spaceUsersEmailId[i] });
                if (user != null && user.email != UserEmail) {
                    listContacts.push(user);
                }
                //console
            }
            res.status(200).send(listContacts);

        }

    } catch (err) {
        console.log(err);
    }
});

//GET CLICKED CHAT ID:--->
router.get("/getCurrentChatID/:token/:memberEmail", async (req, res) => {
    console.log(req.params)
    const decodedToken = VerifyToken(req.params.token);
    const uniqueSpaceId = decodedToken.spaceID;
    const UserEmail = decodedToken.username;
    try {
        if (req.params.memberEmail === "Group") {
            const conversation = await Conversation.find({
                "members": req.params.memberEmail, "spaceID": uniqueSpaceId
            })
            // res.status(200).json(conversation);
            if (conversation.length === 0) {
                //console.log("yo yo")
                const newConversation = new Conversation({
                    members: "Group",
                    spaceID: uniqueSpaceId
                });
                try {
                    const savedConversation = await newConversation.save();
                    res.status(200).json(savedConversation);
                } catch (err) {
                    res.status(500).json(err);
                }
            } else {
                res.status(200).json(conversation);
            }
        }
        else {
            const conversation = await Conversation.find({
                spaceID: uniqueSpaceId,
                "$and": [
                    { "members": UserEmail },
                    { "members": req.params.memberEmail },
                    { "members": { "$size": 2 } }
                ]
            })
            if (conversation.length === 0) {
                console.log("Conversation not Found")
                const newConversation = new Conversation({
                    members: [UserEmail, req.params.memberEmail],
                    spaceID: uniqueSpaceId
                });
                try {
                    const savedConversation = await newConversation.save();
                    console.log("Saving Conversation: ", savedConversation);
                    res.status(200).json(savedConversation);
                } catch (err) {
                    console.log("Svaing Conversation:", err)
                    res.status(500).json(err);
                }
            } else {
                res.status(200).json(conversation);
            }
        }
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});

//SHOW FLOWCHARTS----->
router.get('/viewSpaceFlowcharts/:token', async (req, res) => {
    if (!req.params.token) {
        console.log("Flowchart API ERROR!!")
    } else {
        try {
            const decodedToken = VerifyToken(req.params.token);
            const spaceID = decodedToken.spaceID;
            if (!spaceID) {
                return res.status(400).json({ error: "An error occured while sending request" })
            } else {
                const space = await Space.findOne({ uniqueSpaceId: spaceID })
                const allFlowcharts = space.flowcharts
                res.status(200).send(allFlowcharts);
            }
        }
        catch (err) {
            console.log(err);
        }
    }
});

//ADD FLOWCHARTS:----->
router.post('/addFlowchart', async (req, res) => {
    //console.log(req.body);
    const { token, name, code } = req.body; //object destructuring
    const decodedToken = VerifyToken(token);
    const spaceID = decodedToken.spaceID;
    if (!spaceID || !name || !code) {
        //console.log(memberEmailIDs);
        return res.status(422).json({ error: "Provide all data" });
    }
    try {
        const space = await Space.findOne({ uniqueSpaceId: spaceID });
        //const spaceDoc_ID = space._id
        space.flowcharts.push({ name: name, code: code })
        await space.save()
        return res.status(201).json({ message: "Flowchart added Successfully!" });
    } catch (err) {
        console.log(err);
    }
});

// REMOVE FLOWCHARTS:--->

router.post('/removeFlowchart', async (req, res) => {
    const { token, flowchartDocID } = req.body; //object destructuring
    const decodedToken = VerifyToken(token);
    const spaceID = decodedToken.spaceID;
    if (!spaceID || !flowchartDocID) {
        return res.status(422).json({ error: "Provide all data" });
    }
    try {
        const space = await Space.findOne({ uniqueSpaceId: spaceID });
        space.flowcharts.pull(String(flowchartDocID));
        await space.save();
        return res.status(201).json({ message: "Flowchart removed Successfully!" });
    } catch (err) {
        console.log(err);
    }
});

//UPDATE FLOWCHART:----->
router.post('/updateFlowchart', async (req, res) => {
    //console.log(req.body);
    const { flowchartDocID, token, name, code } = req.body; //object destructuring
    const decodedToken = VerifyToken(token);
    const spaceID = decodedToken.spaceID;
    if (!flowchartDocID || !spaceID) {
        return res.status(422).json({ error: "Provide all data" });
    }
    try {
        await Space.findOneAndUpdate({ uniqueSpaceId: spaceID, "flowcharts._id": flowchartDocID }, { "flowcharts.$.name": name, "flowcharts.$.code": code });
        return res.status(201).json({ message: "Flowchart Updated Successfully!" });
    } catch (err) {
        console.log(req.body);
        console.log(err);
    }
});

//SHOW PROGRAMS----->
router.get('/viewSpacePrograms/:token', async (req, res) => {
    if (!req.params.token) {
        console.log("View Programs API ERROR!!")
    } else {
        try {
            const decodedToken = VerifyToken(req.params.token);
            const spaceID = decodedToken.spaceID;
            if (!spaceID) {
                return res.status(400).json({ error: "An error occured while sending request" })
            } else {
                const space = await Space.findOne({ uniqueSpaceId: spaceID })
                const allPrograms = space.programs
                res.status(200).send(allPrograms);
            }
        }
        catch (err) {
            console.log(err);
        }
    }
});

//ADD PROGRAMS:----->
router.post('/addProgram', async (req, res) => {
    console.log(req.body);
    const { token, name, code, language } = req.body; //object destructuring
    const decodedToken = VerifyToken(token);
    const spaceID = decodedToken.spaceID;
    if (!spaceID || !name || !code || !language) {
        //console.log(memberEmailIDs);
        console.log(req.body)
        return res.status(422).json({ error: "Provide all data" });
    }
    try {
        const space = await Space.findOne({ uniqueSpaceId: spaceID });
        //const spaceDoc_ID = space._id
        space.programs.push({ name: name, code: code, language: language })
        await space.save()
        return res.status(201).json({ message: "Program added Successfully!" });
    } catch (err) {
        console.log(err);
    }
});

// REMOVE PROGRAMS:--->

router.post('/removeProgram', async (req, res) => {
    const { token, programDocID } = req.body; //object destructuring
    const decodedToken = VerifyToken(token);
    const spaceID = decodedToken.spaceID;
    if (!spaceID || !programDocID) {
        return res.status(422).json({ error: "Provide all data" });
    }
    try {
        const space = await Space.findOne({ uniqueSpaceId: spaceID });
        space.programs.pull(String(programDocID));
        await space.save();
        return res.status(201).json({ message: "Program removed Successfully!" });
    } catch (err) {
        console.log(err);
    }
});

//UPDATE PROGRAM:----->
router.post('/updateProgram', async (req, res) => {
    //console.log(req.body);
    const { programDocID, token, name, code, language } = req.body; //object destructuring
    const decodedToken = VerifyToken(token);
    const spaceID = decodedToken.spaceID;
    if (!programDocID || !spaceID || !language) {
        return res.status(422).json({ error: "Provide all data" });
    }
    try {
        await Space.findOneAndUpdate({ uniqueSpaceId: spaceID, "programs._id": programDocID }, { "programs.$.name": name, "programs.$.code": code, "programs.$.language": language });
        return res.status(201).json({ message: "Program Updated Successfully!" });
    } catch (err) {
        console.log(req.body);
        console.log(err);
    }
});

//SHOW COSTS----->
router.get('/viewSpaceCosts/:token', async (req, res) => {
    try {
        var token = req.params.token;
        token = VerifyToken(token);
        const uniqueSpaceId = token.spaceID;
        if (!uniqueSpaceId) {
            return res.status(400).json({ error: "An error occured while sending request" })
        } else {
            const project = await Space.findOne({ uniqueSpaceId: uniqueSpaceId })
            const allCosts = project.costs
            res.status(200).send(allCosts);
        }
    }
    catch (err) {
        console.log(err);
    }
});

//ADD COST:----->
router.post('/addCost', async (req, res) => {
    //console.log(req.body);
    const { token, name, description, amount } = req.body; //object destructuring
    const dToken = VerifyToken(token);
    const spaceID = dToken.spaceID;
    // const emailDomain = dToken.domain;
    if (!spaceID || !name || !description || !amount) {
        //console.log(memberEmailIDs);
        return res.status(422).json({ error: "Provide all data" });
    }
    try {
        const project = await Space.findOne({ uniqueSpaceId: spaceID });
        project.costs.push({ name: name, description: description, amount: amount })
        await project.save()
        return res.status(201).json({ message: "Expense added Successfully!" });
    } catch (err) {
        console.log(err);
    }
});

// REMOVE COST:--->
router.post('/removeCost', async (req, res) => {
    const { token, costDocID } = req.body; //object destructuring
    const dToken = VerifyToken(token);
    const spaceID = dToken.spaceID;
    if (dToken.admin) {
        const managerEmailID = dToken.username;
        if (!managerEmailID || !spaceID || !costDocID) {
            return res.status(422).json({ error: "Provide all data" });
        }
        try {
            // const emailDomain = managerEmailID.substring(managerEmailID.indexOf('@') + 1);
            const project = await Space.findOne({ uniqueSpaceId: spaceID });
            // const taskID = String(taskDocI
            project.costs.pull(String(costDocID));
            await project.save();
            return res.status(201).json({ message: "Expense removed Successfully!" });
        } catch (err) {
            console.log(err);
        }
    }
}
);

//SHOW RESOURCES----->
router.get('/viewSpaceResources/:token', async (req, res) => {
    try {
        console.log("Called resources")
        const dToken = VerifyToken(req.params.token);
        const uniqueSpaceId = dToken.spaceID;
        //const {uniqueSpaceId, emailDomain} = req.body;
        if (!uniqueSpaceId) {
            return res.status(400).json({ error: "An error occured while sending request" })
        } else {
            const space = await Space.findOne({ uniqueSpaceId: uniqueSpaceId })
            const allResources = space.resources
            res.status(200).send(allResources);
        }
    }
    catch (err) {
        console.log(err);
    }
});

//ADD RESOURCE:---->
router.post('/addResource', async (req, res) => {
    //console.log(req.body);
    const { token, name, description, link } = req.body; //object destructuring
    const dToken = VerifyToken(token);
    const spaceID = dToken.spaceID;
    if (!spaceID || !name || !description || !link) {
        //console.log(memberEmailIDs);
        return res.status(422).json({ error: "Provide all data" });
    }
    try {
        const space = await Space.findOne({ uniqueSpaceId: spaceID });
        // project.tasks.push({name: taskName},)
        // await project.save();
        // for (var i = 0; i < memberEmailArr.length; i++) {
        //     const memberExist = project.projectUsersEmailId.includes(memberEmailArr[i]);
        //     if (!memberExist) {
        //         return res.status(422).json({ error: "Member Not Found" });
        //     }
        // }
        space.resources.push({ name: name, description: description, link: link })
        await space.save()
        return res.status(201).json({ message: "Resource added Successfully!" });
    } catch (err) {
        console.log(err);
    }
});

//Remove Resource:--->
router.post('/removeResource', async (req, res) => {
    const { token, resourceDocID } = req.body; //object destructuring
    const dToken = VerifyToken(token);
    const spaceID = dToken.spaceID;
    if (dToken.admin) {
        const managerEmailID = dToken.username;
        if (!managerEmailID || !spaceID || !resourceDocID) {
            return res.status(422).json({ error: "Provide all data" });
        }
        try {
            const project = await Space.findOne({ uniqueSpaceId: spaceID });
            // const taskID = String(taskDocI
            project.resources.pull(String(resourceDocID));
            await project.save();
            return res.status(201).json({ message: "Resource removed Successfully!" });
        } catch (err) {
            console.log(err);
        }
    }

});


module.exports = router;