namespace KPM.Controllers;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;
using Application.Features.Lesson;

[ApiVersion(1.0)]
[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
public class LessonController : ControllerBase
{
    private readonly LessonService _lesson;

    public LessonController(LessonService lessonService)
    {
        _lesson = lessonService;
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetLessonByID(Guid id)
    {
        var lesson = await _lesson.getLesson(id);

        if (lesson is null)
            return NotFound();

        return Ok(lesson);
    }

    [HttpPost]
    public async Task<IActionResult> CreateLesson(
        string title,
        string projectName,
        int departmentId,
        int functionId,
        int industryId,
        string valueProposition,
        string description,
        string imageUrl,
        string personToContact)
    {
        var lessonId = await _lesson.createLesson(
            title,
            projectName,
            departmentId,
            functionId,
            industryId,
            valueProposition,
            description,
            imageUrl,
            personToContact);

        return Ok(lessonId);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateLesson(
        Guid id,
        string title,
        string projectName,
        int departmentId,
        int functionId,
        int industryId,
        string valueProposition,
        string description,
        string imageUrl,
        string personToContact)
    {
        var lessonId = await _lesson.updateLesson(
            id,
            title,
            projectName,
            departmentId,
            functionId,
            industryId,
            valueProposition,
            description,
            imageUrl,
            personToContact);

        if (lessonId is null)
            return NotFound();

        return Ok(lessonId);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteLessonByID(Guid id)
    {
        var result = await _lesson.deleteLesson(id);

        if (result is null)
            return NotFound();

        return Ok(result);
    }
}
