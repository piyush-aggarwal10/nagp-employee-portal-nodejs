const mongoose = require('mongoose');

const JobOpeningSchema = mongoose.Schema({
    projectName: { type: String, required: true },
    clientName: { type: String, required: true },
    technologies: { type: Array, required: true },
    role: { type: String, required: true },
    jobDescription: { type: String, required: true },
    status: { type: String, required: true, default: "open" },
    usersApplied: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users', default: [] }],
    isActive: { type: Boolean, required: true, default: true },
    createdBy: {
        managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
        managerName: { type: "String", required: true }
    },
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now }
});

JobOpeningSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

const JobOpening = mongoose.model('JobOpening', JobOpeningSchema);

module.exports = JobOpening;