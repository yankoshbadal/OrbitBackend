const profileEditValidator = (req) => {

    const editableFields = [
        "gender",
        "firstName",
        "lastName",
        "dob",
        "homeTown",
        "hobbies",
        "interestedIn",
        "bio",
        "profileImageUrl",
        "relationshipStatus",
        "stream",
        "year"
    ];
    
    const isEditAllowed = Object.keys(req.body).every((field)=>editableFields.includes(field));
    
    
    return isEditAllowed;
};

module.exports = {profileEditValidator};