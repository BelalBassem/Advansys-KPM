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

    [HttpGet]
    public async Task<IActionResult> GetFunctions([FromQuery] int? departmentId)
    {
        return Ok(await _function.getFunctions(departmentId));
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
    public async Task<IActionResult> CreateFunction(string name, int departmentId)
    {
        try
        {
            var functionId = await _function.createFunction(name, departmentId);
            return Ok(functionId);
        }
        catch (ArgumentException exception)
        {
            return BadRequest(exception.Message);
        }
    }

    [HttpGet("{functionId:int}/departments")]
    public async Task<IActionResult> GetFunctionDepartments(int functionId)
    {
        return Ok(await _function.getFunctionDepartments(functionId));
    }

    [HttpPost("{functionId:int}/departments/{departmentId:int}")]
    public async Task<IActionResult> AddFunctionToDepartment(int functionId, int departmentId)
    {
        try
        {
            await _function.addFunctionToDepartment(functionId, departmentId);
            return Ok(new { functionId, departmentId });
        }
        catch (ArgumentException exception)
        {
            return BadRequest(exception.Message);
        }
    }

    [HttpDelete("{functionId:int}/departments/{departmentId:int}")]
    public async Task<IActionResult> RemoveFunctionFromDepartment(int functionId, int departmentId)
    {
        var removed = await _function.removeFunctionFromDepartment(functionId, departmentId);
        return removed ? NoContent() : NotFound();
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
