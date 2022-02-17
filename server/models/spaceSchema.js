const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const SpaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    adminEmailId: {
        type: String,
        required: true
    },
    spaceUsersEmailId: [
        {
            type: String,
            required: true
        }
    ],
    uniqueSpaceId: {
        type: String,
        required: true
    },
    spaceDescription: {
        type: String,
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    tasks: [
        {
            name: {
                type: String,
                required: true
            },
            status: {
                type: String,
                required: true
            },
            assignedTo: [
                {
                    type: String,
                    required: true
                }
            ],
            spaceDoc_ID: {
                type: String,
                required: true
            },
            startDate: {
                type: Date,
                required: true
            },
            endDate: {
                type: Date,
                required: true
            },
            taskType: {
                type: String,
                required: false
            },
            time: {
                type: Number,
                required: true
            }
        }
    ],

    goals: [
        {
            name: {
                type: String,
                required: true
            },
            expectedCompletionDate: {
                type: Date,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            type: {
                type: String,
                required: true
            },
            status: { //EITHER COMPLETED OR NOT
                type: String,
                required: true
            }
        }
    ],

    costs: [
        {
            name: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            amount: {
                type: Number,
                required: true
            }

        }
    ],

    resources: [
        {
            name: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            link: {
                type: String,
                required: true
            }

        }
    ],

    flowcharts: [
        {
            name: {
                type: String,
                required: true
            },
            code: {
                type: String,
                required: true
            }
        }
    ],

    programs: [
        {
            name: {
                type: String,
                required: true
            },
            language: {
                type: String,
                required: true
            },
            code: {
                type: String,
                required: true
            }
        }
    ],
})

//Creating collection
const Space = mongoose.model('Space', SpaceSchema);

module.exports = Space;