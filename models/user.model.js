class UserModel {
    constructor(id=null, password=null, firebase_uid, email) {
        this.id = id;
        this.password = password;
        this.firebase_uid = firebase_uid;
        this.email = email;
    }
}

module.exports = UserModel;