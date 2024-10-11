using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CondorV.Models.BD
{
    public class Mesure
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }    
        public DateTime Date { get; set; }
        public double Valeur { get; set; }
        public long GrandeurId { get; set; }
        [JsonIgnore]
        public Grandeur? Grandeur { get; set; }

    }
}
