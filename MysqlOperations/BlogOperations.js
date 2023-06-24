const { MongoClient, TopologyDescriptionChangedEvent } = require("mongodb");
const dotenv = require("dotenv").config();

MongoClient.connect(process.env.URL,(err,client) => {
    if(err) throw err
     console.log("Connected to mongoDb")
    const db = client.db(process.env.MONGODB);
    const collection = db.collection(process.env.COLLECTION)

    function addBlog(obj) {
        collection.insertOne(obj,(err,res) => {
            if(err) throw err
            return res;
        })
    }
    function selectBlog() {
        collection.find({}).toArray((err,documents) => {
            if(err) throw err
            return documents
        })
    }
    function deleteBlog(obj) {
        collection.deleteMany(obj,(err,res) => {
            if(err) throw err
            return res;
        })
    }
    function selectAllBlogs(obj) {
        collection.find(obj).toArray((err,documents) => {
            if(err) throw err
            return documents
        })
    }
    client.close()
})

module.exports = {
    addBlog,
    selectBlog,
    deleteBlog,
    selectAllBlogs,
}