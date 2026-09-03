namespace KPM.Controllers;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;
using Application.Features.Lesson;
using Application.Lessons.DTOs;
using LessonEntity = Domain.Entities.Lesson;
using LessonDocumentEntity = Domain.Entities.LessonDocument;
using LessonKeywordEntity = Domain.Entities.LessonKeyword;
using LessonLinkEntity = Domain.Entities.LessonLink;

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

    [HttpGet]
    public async Task<IActionResult> GetLessons()
    {
        var lessons = await _lesson.getAllLessons();
        return Ok(lessons.Select(MapToDto).ToList());
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetLessonByID(Guid id)
    {
        var lesson = await _lesson.getLesson(id);

        if (lesson is null)
            return NotFound();

        return Ok(MapToDto(lesson));
    }

    [HttpPost]
    public async Task<IActionResult> CreateLesson([FromBody] LessonRequest request)
    {
        try
        {
            var lessonId = await _lesson.createLesson(MapToEntity(request));
            return Ok(lessonId);
        }
        catch (ArgumentException exception)
        {
            return BadRequest(exception.Message);
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateLesson(Guid id, [FromBody] LessonRequest request)
    {
        Guid? lessonId;

        try
        {
            lessonId = await _lesson.updateLesson(id, MapToEntity(request));
        }
        catch (ArgumentException exception)
        {
            return BadRequest(exception.Message);
        }

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

    private static LessonEntity MapToEntity(LessonRequest request)
    {
        return new LessonEntity
        {
            Title = request.Title,
            ProjectName = request.ProjectName,
            DepartmentId = request.DepartmentId,
            FunctionId = request.FunctionId,
            IndustryId = request.IndustryId,
            PersonToContactId = request.PersonToContactId,
            Summary = request.Summary,
            Description = request.Description,
            ImageUrl = request.ImageUrl,
            Links = (request.Links ?? new List<string>())
                .Select(link => new LessonLinkEntity { Url = link })
                .ToList(),
            Keywords = (request.Keywords ?? new List<string>())
                .Select(keyword => new LessonKeywordEntity { Name = keyword })
                .ToList(),
            Documents = (request.Documents ?? new List<LessonDocumentRequest>())
                .Select(document => new LessonDocumentEntity
                {
                    FileName = document.FileName,
                    FileUrl = document.FileUrl,
                    ContentType = document.ContentType
                })
                .ToList()
        };
    }

    private static LessonDTO MapToDto(LessonEntity lesson)
    {
        return new LessonDTO
        {
            Id = lesson.Id,
            Title = lesson.Title,
            ProjectName = lesson.ProjectName,
            DepartmentId = lesson.DepartmentId,
            FunctionId = lesson.FunctionId,
            IndustryId = lesson.IndustryId,
            PersonToContactId = lesson.PersonToContactId,
            PersonToContact = lesson.PersonToContact is null
                ? null
                : new LessonContactDTO
                {
                    Id = lesson.PersonToContact.Id,
                    Name = lesson.PersonToContact.Name,
                    Email = lesson.PersonToContact.Email,
                    Role = lesson.PersonToContact.Role
                },
            Summary = lesson.Summary,
            Description = lesson.Description,
            ImageUrl = lesson.ImageUrl,
            Links = lesson.Links.Select(link => link.Url).ToList(),
            Keywords = lesson.Keywords.Select(keyword => keyword.Name).ToList(),
            Documents = lesson.Documents
                .Select(document => new LessonDocumentDTO
                {
                    Id = document.Id,
                    FileName = document.FileName,
                    FileUrl = document.FileUrl,
                    ContentType = document.ContentType
                })
                .ToList(),
            CreatedDate = lesson.CreatedDate,
            ModifiedDate = lesson.ModifiedDate
        };
    }
}
