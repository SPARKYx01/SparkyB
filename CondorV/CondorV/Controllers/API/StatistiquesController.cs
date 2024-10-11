using Microsoft.AspNetCore.Mvc;
using CondorV.Data;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace CondorV.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatistiquesController : ControllerBase
    {
        private readonly CondorVContext _context;

        public StatistiquesController(CondorVContext context)
        {
            _context = context;
        }

        // GET: api/Statistiques/Utilisateurs
        [HttpGet("utilisateurs")]
        public async Task<ActionResult<int>> GetNombreUtilisateurs()
        {
            if (_context.Utilisateur == null)
            {
                return NotFound();
            }
            var count = await _context.Utilisateur.CountAsync();
            return Ok(count);
        }

        // GET: api/Statistiques/Sites
        [HttpGet("sites")]
        public async Task<ActionResult<int>> GetNombreSites()
        {
            if (_context.Site == null)
            {
                return NotFound();
            }
            var count = await _context.Site.CountAsync();
            return Ok(count);
        }

        // GET: api/Statistiques/Barrages
        [HttpGet("barrages")]
        public async Task<ActionResult<int>> GetNombreBarrages()
        {
            if (_context.Site == null)
            {
                return NotFound();
            }
            var count = await _context.Site.CountAsync(s => s.Type == "Barrage");
            return Ok(count);
        }
    }
}
