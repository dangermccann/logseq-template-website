const AWS = require('aws-sdk')
const DynamoDB = AWS.DynamoDB

class DataAccess {
    constructor(region, table, userLovesTable) {
        this.dynamoDbClient = new DynamoDB.DocumentClient({ region: region || 'us-east-1' })
        this.table = table || 'logseq-templates';
        this.userLovesTable = userLovesTable || 'logseq-templates-user-loves';
    }
    
    async getUserTemplates(user) {
        const params = {
            TableName: this.table,
            KeyConditionExpression: '#user = :value',
            ExpressionAttributeNames: {
                "#user": "User"
            },
            ExpressionAttributeValues: {
                ':value': user,
            },
        };

        return this.query(params);
    }

    async getMostPopularTemplates(filter) {
        const params = {
            ProjectionExpression: "#status, #user, Template, Description, Content, Popularity",
            TableName: this.table,
            IndexName: 'Status-Popularity-index',
            KeyConditionExpression: '#status = :value',
            ScanIndexForward: false,
            ExpressionAttributeNames: {
                "#status": "Status",
                "#user": "User",
            },
            ExpressionAttributeValues: {
                ':value': "OK",
            },
            Limit: 100
        };

        if(filter) {
            params.FilterExpression = `contains(SearchTerm, :filter)`
            params.ExpressionAttributeValues[":filter"] = filter.toLowerCase();
        }

        return this.query(params)
    }

    async getMostRecentTemplates(filter) {
        const params = {
            ProjectionExpression: "#status, #timestamp, #user, Template, Description, Content, Popularity",
            ExpressionAttributeNames: {
                "#status": "Status",
                "#user": "User",
                "#timestamp": "Timestamp"
            },
            ExpressionAttributeValues: {
                ':value': "OK",
            },
            ScanIndexForward: false,
            TableName: this.table,
            IndexName: 'Status-Timestamp-index',
            KeyConditionExpression: '#status = :value',
            Limit: 100
        };

        if(filter) {
            params.FilterExpression = `contains(SearchTerm, :filter)`
            params.ExpressionAttributeValues[":filter"] = filter.toLowerCase();
        }

        return this.query(params)
    }

    async query(params) {
        return new Promise((resolve, reject) => { 
            this.dynamoDbClient.query(params, (error, data) => {
                if (error) {
                    console.log("DynamoDB query error", error);
                    reject(error)
                } else {
                    resolve(data.Items)
                }
            });
        })
    }

}

module.exports = new DataAccess()
