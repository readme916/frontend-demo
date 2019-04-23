export default {
   
    methods:{

        enumLabel:function(field,v){
            var application = this.application
            var resource = this.resource
            var resourceStructure = this.structure[application][resource]
            
            if (field.indexOf(".") != -1) {
                var targetName = resourceStructure.fieldDetailMap[field.split(".")[0]]
                .targetEntityName;
                var targetStructure =  this.structure[application][targetName]
              if (Object.keys(targetStructure.fieldDetailMap).length != 0) {
                if (targetStructure.fieldDetailMap[field.split(".")[1]]) {
                  var r =  targetStructure.fieldDetailMap[field.split(".")[1]].values.find(e => e.value == v)
                  if(r && r.label){
                    return r.label
                  }else{
                    return v
                  }
                }
              }
            
          } else {
            var r =  resourceStructure.fieldDetailMap[field].values.find(e => e.value == v);
            if(r && r.label){
              return r.label
            }else{
              return v
            }
          }
        },

        columnFormat: function(field) {
           var application = this.application
           var resource = this.resource
            var resourceStructure = this.structure[application][resource]
            if (field.indexOf(".") != -1) {
              if (
                resourceStructure.fieldDetailMap[field.split(".")[0]].dataType ==
                "OBJECT"
              ) {
                var targetName = resourceStructure.fieldDetailMap[field.split(".")[0]]
                  .targetEntityName;
                var targetStructure =  this.structure[application][targetName]
                if (Object.keys(targetStructure.fieldDetailMap).length != 0) {
                  if (targetStructure.fieldDetailMap[field.split(".")[1]]) {
                    return targetStructure.fieldDetailMap[field.split(".")[1]]
                      .dataType;
                  }
                }
              }
            } else {
              return resourceStructure.fieldDetailMap[field].dataType;
            }
          },

          getValue: function(data,field){
            return eval("data." + field);
          },

          getLabel:function(data,field){
            var format = this.columnFormat(field)
            if(format=="DOUBLE"){
                return this.getValue(data,field).toFixed(4)
            }else if(format=="ENUM"){
                return this.enumLabel(field,this.getValue(data,field))
            }else if(format=="BOOLEAN"){
                if(this.getValue(data,field)){
                    return '是'
                }else{
                    return '否'
                }
            }else if (format== "DATE") {
              return this.$options.filters.date_format(new Date(this.getValue(data,field)));
            } else {
              return this.getValue(data,field);
            }
          }
    },
    computed:{
      structure: function(){
        return this.$store.state.d2admin.structure.structure
    } ,
      label: function(){
        return this.getLabel(this.item,this.field)
      },
      value: function(){
         return this.getValue(this.item,this.field)
      },
      format: function(){
        return this.columnFormat(this.field)
      }
    }

}