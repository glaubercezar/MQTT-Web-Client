angular
    .module('app.services')
    .factory('avroHelper', [function() {        

        return {

            encode: function(schema, json) {
                
                var msg = avro.Type.forSchema(schema);
                var buf = msg.toBuffer(json);

                return buf;
            },

            decode: function(schema, buffer) {

                var msg = avro.Type.forSchema(schema);
                var res = msg.fromBuffer(buffer);

                return res;
            }            

        };
    }]);