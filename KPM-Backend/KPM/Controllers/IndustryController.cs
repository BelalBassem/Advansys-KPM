namespace KPM.Controllers;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;
using Application.Features.Industry;

[ApiVersion(1.0)]
[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
public class IndustryController : ControllerBase
{
    private readonly IndustryService _industry;

    public IndustryController(IndustryService industryService)
    {
        _industry = industryService;
    }

    [HttpGet]
    public async Task<IActionResult> GetIndustries()
    {
        var industries = await _industry.getAllIndustries();
        return Ok(industries);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetIndustryByID(int id)
    {
        var industry = await _industry.getIndustry(id);
        return industry is null ? NotFound() : Ok(industry);
    }

    [HttpPost]
    public async Task<IActionResult> CreateIndustry(string name)
    {
        var industryId = await _industry.createIndustry(name);

        return Ok(industryId);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateIndustry(int id, string name)
    {
        var industryId = await _industry.updateIndustry(id, name);

        if (industryId is null)
            return NotFound();

        return Ok(industryId);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteIndustryByID(int id)
    {
        var result = await _industry.deleteIndustry(id);

        if (result is null)
            return NotFound();

        return Ok(result);
    }
}
