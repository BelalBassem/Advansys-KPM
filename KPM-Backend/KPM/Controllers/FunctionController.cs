namespace KPM.Controllers;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;
using Application.Features.Function;

[ApiVersion(1.0)]
[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
public class FunctionController : ControllerBase
{
    private readonly FunctionService _function;

    public FunctionController(FunctionService fs)
    {
        _function = fs;
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetFunctionByID(int id)
    {
        var function = await _function.getFunction(id);

        if (function is null)
            return NotFound();

        return Ok(function);
    }

    [HttpPost]
    public async Task<IActionResult> CreateFunction(string name)
    {
        var functionId = await _function.createFunction(name);

        return Ok(functionId);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateFunction(int id, string name)
    {
        var functionId = await _function.updateFunction(id, name);

        if (functionId is null)
            return NotFound();

        return Ok(functionId);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteFunctionByID(int id)
    {
        var result = await _function.deleteFunction(id);

        if (result is null)
            return NotFound();

        return Ok(result);
    }
}
