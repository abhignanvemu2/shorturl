// softDeletePlugin.js

const softDelete = (schema) => {
  
    // Soft delete method
    schema.methods.softDelete = function(deletedBy = 'admin') {
      this.isDeleted = new Date();
      this.deletedBy = deletedBy;
      return this.save();
    };
  
    // Restore method
    schema.methods.restore = function() {
      this.isDeleted = null;
      this.deletedBy = null;
      return this.save();
    };
  
    const excludeDeletedRecords = function(next) {
      this.where({ isDeleted: null });
      next();
    };
  
    schema.pre(/^find/, excludeDeletedRecords);
    schema.pre(/^findOne/, excludeDeletedRecords);
    schema.pre(/^findOneAndUpdate/, excludeDeletedRecords);
    schema.pre(/^findById/, excludeDeletedRecords);
    schema.pre(/^update/, excludeDeletedRecords);
    schema.pre(/^updateOne/,excludeDeletedRecords);
    schema.pre(/^updateMany/, excludeDeletedRecords);
  };
  
  module.exports = softDelete;
  