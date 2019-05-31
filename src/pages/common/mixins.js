export default {

  methods: {

    enumLabel: function (field, v) {
      if (field.indexOf(".") != -1) {
        var targetName = this.resourceStructure.fieldDetailMap[field.split(".")[0]].targetEntityName;
        var targetStructure = this.allStructure[this.application][targetName]
        if (Object.keys(targetStructure.fieldDetailMap).length != 0) {
          if (targetStructure.fieldDetailMap[field.split(".")[1]]) {
            var r = targetStructure.fieldDetailMap[field.split(".")[1]].values.find(e => e.value == v)
            if (r && r.label) {
              return r.label
            } else {
              return v
            }
          }
        }

      } else {
        var r = this.resourceStructure.fieldDetailMap[field].values.find(e => e.value == v);
        if (r && r.label) {
          return r.label
        } else {
          return v
        }
      }
    },

    columnFormat: function (field) {

      if (field.indexOf(".") != -1) {
        if (
          this.resourceStructure.fieldDetailMap[field.split(".")[0]].dataType ==
          "OBJECT"
        ) {
          var targetName = this.resourceStructure.fieldDetailMap[field.split(".")[0]].targetEntityName;
          var targetStructure = this.allStructure[this.application][targetName]
          if (Object.keys(targetStructure.fieldDetailMap).length != 0) {
            if (targetStructure.fieldDetailMap[field.split(".")[1]]) {
              return targetStructure.fieldDetailMap[field.split(".")[1]]
                .dataType;
            }
          }
        }
      } else {
        return this.resourceStructure.fieldDetailMap[field].dataType;
      }
    },
    getRichEditor: function (field) {

        if(this.resourceStructure.fieldDetailMap[field] && this.resourceStructure.fieldDetailMap[field].richEditor){
          return true;
        }else{
          return false;
        }
    },
    getValue: function (data, field) {
      if (field.indexOf(".") != -1) {
        var sp = field.split(".")
        if (eval("data." + sp[0])) {
          return eval("data." + field);
        } else {
          console.log(field + "对象不存在")
        }
      } else {
        return eval("data." + field);
      }
    },

    getLabel: function (data, field) {
      var format = this.columnFormat(field)
      if (format == "OBJECT") {
        return ""
      } else if (format == "DOUBLE") {
        if (this.getValue(data, field)) {
          return this.getValue(data, field).toFixed(4)
        } else {
          return 0
        }
      } else if (format == "ENUM") {
        if (this.getValue(data, field)) {
          return this.enumLabel(field, this.getValue(data, field))
        } else {
          return null
        }
      } else if (format == "BOOLEAN") {
        if (this.getValue(data, field)) {
          return '是'
        } else {
          return '否'
        }
      } else if (format == "DATE") {
        if (this.getValue(data, field)) {
          return this.$options.filters.date_format(new Date(this.getValue(data, field)));
        } else {
          return ""
        }
      } else {
        return this.getValue(data, field);
      }
    }
  },
  computed: {
    resourceStructure: function () {
      return this.$store.state.d2admin.structure.structure[this.application][this.resource]
    },
    allStructure: function () {
      return this.$store.state.d2admin.structure.structure
    },
    label: function () {
      return this.getLabel(this.item, this.field)
    },
    value: function () {
      return this.getValue(this.item, this.field)
    },
    format: function () {
      return this.columnFormat(this.field)
    },
    richEditor: function () {
      return this.getRichEditor(this.field)
    }
  }

}